MONO_VERSION="5.4.1.7"

# Begin script
cd "`dirname "$0"`" || exit 1
set -e

# Detect installed Mono
function test-mono {
    if which $1 > /dev/null 2>&1; then
        ln -sfv `which $1` dotnet-run
        exit 0
    fi
}

if [ "$DETECT_MONO" != 0 ]; then
    if [ -f dotnet-run ]; then
        exit 0
    fi
    test-mono mono64
    test-mono mono
fi

# Detect platform
case "$(uname -s)" in
Darwin)
    MONO_URL=https://www.nuget.org/api/v2/package/mono-macOS/$MONO_VERSION
    ;;
*)
    test-mono mono
    echo -e "ERROR: Mono was not found" >&2
    echo -e "\nPlease follow instructions at https://www.mono-project.com/download/ to install Mono, and try again." >&2
    exit 1
    ;;
esac

# Download Mono
function download-error {
    echo -e "\nERROR: Download failed." >&2
    echo -e "\nPlease try again later, or open an issue on GitHub (https://github.com/mortend/dotnet-run/issues)." >&2
    exit 1
}

function get-zip {
    local url=$1
    local dir=$2
    local zip=`basename "$2"`.zip

    if [ -f "$zip" ]; then
        rm -rf "$dir" "$zip"
    elif [ -d "$dir" ]; then
        return
    fi

    echo "Downloading $url"
    curl -# -L "$url" -o "$zip" -S --retry 3 || download-error
    mkdir -p "$dir"
    unzip -q "$zip" -d "$dir" || download-error
    rm -rf "$zip"
}

if [ -z "$DOTNET_RUN_HOME" ]; then
    DOTNET_RUN_HOME=~/.dotnet-run
fi

get-zip "$MONO_URL" $DOTNET_RUN_HOME
chmod +x $DOTNET_RUN_HOME/bin/mono
ln -sfv $DOTNET_RUN_HOME/bin/mono dotnet-run

# Fixup paths in dylibs
cd $DOTNET_RUN_HOME/lib

IFS=$'\n'
for libA in `ls -1 *.dylib`; do
    for libB in `ls -1 *.dylib`; do
        install_name_tool -change "@rpath/Mono/lib/$libB" "@loader_path/$libB" $libA
    done

    install_name_tool -id $libA $libA
    otool -L $libA
done

sed -i -e 's/\@rpath\/Mono\/lib\///g' ../etc/mono/config
