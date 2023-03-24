const { getDotNetPath, installDotNet } = require(".")
const readlineSync = require("readline-sync")

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

installDotNet().then(process.exit)
