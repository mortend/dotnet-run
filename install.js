const { getDotNetPath } = require(".")
const readlineSync = require("readline-sync")
const spawn = require("child_process").spawn
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

if (process.platform === "win32") {
    const ps = spawn("powershell.exe", [
        "-NoProfile", "-ExecutionPolicy", "unrestricted", "-Command",
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; &([scriptblock]::Create((Invoke-WebRequest -UseBasicParsing 'https://dot.net/v1/dotnet-install.ps1')))"
    ])
    ps.stdout.on("data", data => console.log(data.toString()))
    ps.stderr.on("data", data => console.error(data.toString()))
    ps.on("exit", process.exit)
    ps.stdin.end()
} else {
    bash(["-c", "curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin"], process.exit)
}
