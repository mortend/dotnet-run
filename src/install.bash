if [ -z "$DOTNET_RUN_HOME" ]; then
    DOTNET_RUN_HOME=~/.dotnet-run
fi

if [ -z "$MONO_VERSION" ]; then
    MONO_VERSION="6.0.0.311"
fi

case "$(uname -s)" in
Darwin)
    MONO_URL=https://github.com/mortend/dotnet-run/releases/download/mono-6.0.0.311/mono-6.0.0.311-mac.tgz
    ;;
esac

# Begin script
cd "`dirname "$0"`" || exit 1
set -e

# Detect installed Mono
function version-test {
    local mono="$1"
    local op="$2"
    local other_version="$3"

    # Test that command works
    "$mono" --version > /dev/null 2> /dev/null || return 1

    if [ -z "$other_version" ]; then
        return 0
    fi

    local version=`"$mono" --version | node get-version.js`
    if [ -z "$version" ]; then
        echo -e "WARNING: Failed to detect version of '$mono'." >&2
        return 0
    fi

    if node version-$op.js "$version" "$other_version"; then
        echo "using Mono version $version from $mono"
        return 0
    fi

    return 1
}

function version-gte {
    version-test "$1" gte "$2"
}

function version-gt {
    version-test "$1" gt "$2"
}

SYMLINK_DIR="$DOTNET_RUN_HOME/.bin"
SYMLINK_MONO="$SYMLINK_DIR/mono"

function resolve-symlinks {
    local path=$1
    while [ -h "$path" ]; do
        local dir="$( cd -P "$( dirname "$path" )" && pwd )"
        local path="$(readlink "$path")"
        [[ "$path" != /* ]] && path="$dir/$path"
    done

    echo $path
}

function success-if-compatible {
    if which "$1" > /dev/null 2>&1; then
        local mono=`which "$1"`
        local mono=`resolve-symlinks "$mono"`
        if version-gte "$mono" "$MONO_VERSION"; then
            mkdir -p "$SYMLINK_DIR"
            ln -sf "$mono" "$SYMLINK_MONO" && exit 0
        fi
    fi
}

function success-if-newer-than {
    if which "$1" > /dev/null 2>&1; then
        local mono=`which "$1"`
        local mono=`resolve-symlinks "$mono"`
        if version-gt "$mono" "$2"; then
            mkdir -p "$SYMLINK_DIR"
            ln -sf "$mono" "$SYMLINK_MONO" && exit 0
        fi
    fi
}

if [ "$FORCE_MONO_DOWNLOAD" != 1 ]; then
    if [ -f "$SYMLINK_MONO" ]; then
        MONO=`resolve-symlinks "$SYMLINK_MONO"`

        # If already exists, check if a newer version is installed on the system
        symlink_version=`"$MONO" --version | node get-version.js`
        if [ -n "$symlink_version" ]; then
            success-if-newer-than mono64 "$symlink_version"
            success-if-newer-than mono "$symlink_version"
        fi

        if version-gte "$MONO" "$MONO_VERSION"; then
            exit 0
        fi
    fi

    success-if-compatible "$DOTNET_RUN_HOME/mono/bin/mono"
    success-if-compatible mono64
    success-if-compatible mono
fi

if [ -z "$MONO_URL" ]; then
    success-if-compatible mono
    echo -e "ERROR: Mono (>= $MONO_VERSION) was not found." >&2
    echo -e "\nPlease follow instructions at https://www.mono-project.com/download/ to install Mono, and try again." >&2
    exit 1
fi

# Download Mono
function download-error {
    echo -e "\nERROR: Download failed." >&2
    echo -e "\nPlease try again later, or open an issue on GitHub (https://github.com/mortend/dotnet-run/issues)." >&2
    exit 1
}

function get-tgz {
    local url=$1
    local dir=$2
    local tgz=$2.tgz

    if [ -f "$tgz" ]; then
        rm -rf "$dir" "$tgz"
    elif [ -d "$dir" ]; then
        if version-gte "$dir/mono/bin/mono" "$MONO_VERSION"; then
            return
        fi
    fi

    echo "Downloading $url"
    curl -# -L "$url" -o "$tgz" -S --retry 3 || download-error
    mkdir -p "$dir"
    tar -xzf "$tgz" -C "$dir" || download-error
    rm -rf "$tgz"
}

get-tgz "$MONO_URL" "$DOTNET_RUN_HOME"
success-if-compatible "$DOTNET_RUN_HOME/mono/bin/mono"
download-error
