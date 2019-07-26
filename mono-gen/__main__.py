import subprocess
import argparse
import os
import urllib
import tarfile
import glob
import shutil
from os import path
from install_name_tool import *
import re

containing_dir = path.dirname(path.realpath(__file__))
working_dir = os.getcwd()

parser = argparse.ArgumentParser(description='\
Generates a minified mono package, that can be bundled and shipped. \
By default it uses the current installed mono as the base for the minification. \
However use `--mono-version` to specify a specific version to use, or use `--custom-mono`.')

parser.add_argument('--mono-version', help='\
A mono version number, that will be used as reference eg. `4.8.1` \
which will be resolved to `/Library/Frameworks/Mono.framework/Versions/4.8.1`.')

parser.add_argument('--custom-mono', help='\
A custom path to mono. NOTE: MONO_VERSION is ignored in that case. \
This path should be the root path to mono. \
Eg. `/Library/Frameworks/Mono.framework/Versions/4.4.1`. This mode is useful in case of a custom mono build.')

parser.add_argument('--libgdiplus-location', help="\
Specify the location of libgdiplus (by default found in [MONO_ROOT]/lib). This option expects a directory path to where libgdiplus is located. \
Used when building from source, since libgdiplus isn't part of that process by default.")

parser.add_argument('--libs-install-id', default='@loader_path', help="\
Override the install-id that is set for the native libraries. This id is by default '@loader_path'. \
")

args = parser.parse_args()

if args.custom_mono:
    mono_base = args.custom_mono
elif args.mono_version:
    mono_base = path.join("/Library/Frameworks/Mono.framework/Versions/", args.mono_version)
else:
    mono_base = path.realpath("/Library/Frameworks/Mono.framework/Versions/Current")

mono_base_libdir = path.join(mono_base, 'lib')

if args.libgdiplus_location:
    gdipluslib_location = args.libgdiplus_location
else:
    gdipluslib_location = mono_base_libdir

install_path_prefix = mono_base
minimized_output = path.join(working_dir, 'mono')

def create_dirs_if_required(dir_path):
    if not path.exists(dir_path):
        os.makedirs(dir_path)

def match_file_recursive(path, extension):
    for root, dirnames, filenames in os.walk(path):
        files_in_question = [filename for filename in filenames if filename.endswith(extension)]
        for filename in files_in_question:
            yield os.path.join(root, filename)

        dirs_in_question = [dirname for dirname in dirnames if dirname.endswith(extension)]
        for dirname in dirs_in_question:
            yield os.path.join(root, dirname)

def read_all_text(path):
    with open(path, 'r') as content_file:
        return content_file.read()

def write_all_text(path, content):
    with open(path, 'w') as content_file:
        content_file.write(content)

def minimize():
    bin_folder = path.join(minimized_output, 'bin')
    lib_folder = path.join(minimized_output, 'lib')
    etc_folder = path.join(minimized_output, 'etc')

    create_dirs_if_required(bin_folder)
    create_dirs_if_required(lib_folder)
    create_dirs_if_required(etc_folder)

    print("Copying files")
    mono_exe_path = path.join(install_path_prefix, 'bin', 'mono64')
    if not path.exists(mono_exe_path):
        mono_exe_path = path.join(install_path_prefix, 'bin', 'mono')
     
    shutil.copy(mono_exe_path, path.join(bin_folder, 'mono'))
    add_rpath(path.join(bin_folder, 'mono'), '@executable_path/../../')
    shutil.copytree(path.join(install_path_prefix, 'lib', 'mono', '4.5'), path.join(lib_folder, 'mono', '4.5'), symlinks=True)
    shutil.copytree(path.join(install_path_prefix, 'lib', 'mono', 'gac'), path.join(lib_folder, 'mono', 'gac'), symlinks=True)
    shutil.copytree(path.join(install_path_prefix, 'etc', 'mono'), path.join(etc_folder, 'mono'), symlinks=True)

    mono_config = read_all_text(path.join(etc_folder, 'mono', 'config'))
    mono_config = re.sub("\$mono_libdir", args.libs_install_id, mono_config)
    mono_config = re.sub(re.escape(mono_base_libdir) + "/*", "", mono_config)
    write_all_text(path.join(etc_folder, 'mono', 'config'), mono_config)

    create_dirs_if_required(path.join(etc_folder, 'fonts'))
    shutil.copy(path.join(containing_dir, 'fonts.conf'), path.join(etc_folder, 'fonts'))

    print("Removing unnecessary files")

    for f in match_file_recursive(minimized_output, ".exe"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".mdb"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".targets"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".tasks"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".pdb"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".xml"):
        os.remove(f)
    for f in match_file_recursive(minimized_output, ".xsd"):
        os.remove(f)
    for d in match_file_recursive(minimized_output, ".dSYM"):
        shutil.rmtree(d, ignore_errors=True)
    os.remove(path.join(lib_folder, 'mono', '4.5', 'mcs.exe.dylib'))

    assemblies_4_5 = path.join(lib_folder, 'mono', '4.5')
    assemblies_gac = path.join(lib_folder, 'mono', 'gac')
    assemblies_to_exclude = [
        "Microsoft.Build*",
        "RabbitMQ*", 
        "monodoc*", 
        "nunit*", 
        "PEAPI*", 
        # "*FSharp*",
        "Mono.Cecil.VB*",
        "Microsoft.VisualBasic*",
        "Mono.WebServer2*",
        "*gtk-sharp*",
        "*gdk-sharp*",
        "*glib-sharp*",
        "*pango-sharp*",
        "*atk-sharp*",
        "*glade-sharp*",
        "*gtk-dotnet*",
        "vbnc.rsp",
        "*Microsoft.CodeAnalysis*",
        "*.pdb"]

    for list_of_files in [glob.glob(path.join(assemblies_4_5, pattern)) for pattern in assemblies_to_exclude]:
        for f in list_of_files: 
            if path.exists(f):
                os.remove(f)

    for list_of_dirs in [glob.glob(path.join(assemblies_gac, pattern)) for pattern in assemblies_to_exclude]:
        for d in list_of_dirs:
            shutil.rmtree(d, ignore_errors=False)
    
    print("Copying library dependencies")
    source_base_paths = [install_path_prefix, gdipluslib_location]
    copy_lib_and_dependencies(path.join(install_path_prefix, 'lib', 'libmono-native-compat.dylib'), lib_folder, args.libs_install_id, source_base_paths)
    copy_lib_and_dependencies(path.join(install_path_prefix, 'lib', 'libmonosgen-2.0.dylib'), lib_folder, args.libs_install_id, source_base_paths)
    copy_lib_and_dependencies(path.join(install_path_prefix, 'lib', 'libMonoPosixHelper.dylib'), lib_folder, args.libs_install_id, source_base_paths)
    copy_lib_and_dependencies(path.join(gdipluslib_location, "libgdiplus.dylib"), lib_folder, args.libs_install_id, source_base_paths)

    print("Finding remaining absolute paths to mono install")
    fixup_all_dylib_references(lib_folder, args.libs_install_id, source_base_paths)

minimize()
