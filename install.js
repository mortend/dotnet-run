const { getDotNetPath } = require(".")
const readlineSync = require("readline-sync")
const bash = require("xbash")

const dotnet = getDotNetPath()

if (dotnet) {
    console.log("dotnet detected:", dotnet)
    return 0
}

console.error("The 'dotnet' command was not found.")

if (!process.stdout.isTTY ||
    !readlineSync.keyInYN("\nDo you want to install .NET now?")) {
    return 0
}

// https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-install-script
bash(["-c", "curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin"], process.exit)
