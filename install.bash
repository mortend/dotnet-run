if [ -z "$DOTNET_RUN_HOME" ]; then
    DOTNET_RUN_HOME=~/.dotnet-run
fi

if [ -z "$MIN_MONO_VERSION" ]; then
    MIN_MONO_VERSION="5.4.1.7"
fi

# Begin script
cd "`dirname "$0"`" || exit 1
set -e

# Detect installed Mono
function version-gte {
    if [ -z "$2" ]; then
        return 0
    fi

    local version=`"$1" --version | head -n1 | egrep -o '[0-9].*-[0-9]' | awk '{print $1;}'`
    node version-gte.js "$version" "$2"
}

function success-if-compatible {
    if which "$1" > /dev/null 2>&1; then
        if version-gte "$1" "$MIN_MONO_VERSION"; then
            ln -sfv "`which "$1"`" dotnet-run
            exit 0
        fi
    fi
}

if [ "$FORCE_MONO_DOWNLOAD" != 1 ]; then
    if [ -f ./dotnet-run ]; then
        exit 0
    fi

    success-if-compatible "$DOTNET_RUN_HOME/mono/bin/mono"
    success-if-compatible mono64
    success-if-compatible mono
fi

# Detect platform
case "$(uname -s)" in
Darwin)
    MONO_VERSION="6.0.0.311"
    MONO_URL=https://github.com/mortend/dotnet-run/releases/download/mono-$MONO_VERSION-macOS/mono-$MONO_VERSION-macOS.tgz
    ;;
*)
    success-if-compatible mono
    echo -e "ERROR: Mono (>= $MIN_MONO_VERSION) was not found." >&2
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

function get-tgz {
    local url=$1
    local dir=$2
    local tgz=`basename "$2"`.tgz

    if [ -f "$tgz" ]; then
        rm -rf "$dir" "$tgz"
    elif [ -d "$dir" ]; then
        if version-gte "$dir/mono/bin/mono" $MONO_VERSION; then
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
