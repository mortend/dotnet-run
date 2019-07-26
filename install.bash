MONO_VERSION="6.0.0.311"

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
    MONO_URL=https://github.com/mortend/dotnet-run/releases/download/mono-$MONO_VERSION-macOS/mono-$MONO_VERSION-macOS.tgz
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

function get-tgz {
    local url=$1
    local dir=$2
    local tgz=`basename "$2"`.tgz

    if [ -f "$tgz" ]; then
        rm -rf "$dir" "$tgz"
    elif [ -d "$dir" ]; then
        return
    fi

    echo "Downloading $url"
    curl -# -L "$url" -o "$tgz" -S --retry 3 || download-error
    mkdir -p "$dir"
    tar -xzf "$tgz" -C "$dir" || download-error
    rm -rf "$tgz"
}

if [ -z "$DOTNET_RUN_HOME" ]; then
    DOTNET_RUN_HOME=~/.dotnet-run
fi

get-tgz "$MONO_URL" "$DOTNET_RUN_HOME"
ln -sfv "$DOTNET_RUN_HOME/mono/bin/mono" dotnet-run
