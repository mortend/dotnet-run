const fs = require("fs")
const os = require("os")
const path = require("path")
const which = require("which")
const { spawn } = require("child_process")
const readlineSync = require("readline-sync")

function getDotNetPath() {
    for (const dotnet of which.sync("dotnet", {
        all: true,
        nothrow: true
    }) || []) {
        return dotnet
    }

    if (process.platform === "win32") {
        // %LOCALAPPDATA%\Microsoft\dotnet\dotnet.exe
        const localappdata = process.env.LOCALAPPDATA
        const localappdataExe = path.join(localappdata, "Microsoft", "dotnet", "dotnet.exe")

        if (fs.existsSync(localappdataExe))
            return localappdataExe
    } else {
        // ~/.dotnet/dotnet
        const homedir = os.homedir()
        const dotnetHome = path.join(homedir, ".dotnet")
        const dotnetHomeExe = path.join(dotnetHome, "dotnet")

        if (fs.existsSync(dotnetHomeExe))
            return dotnetHomeExe
    }
}

function installDotNet() {
    // https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-install-script
    return new Promise(resolve => {
        if (process.platform === "win32") {
            const ps = spawn("powershell.exe", [
                "-NoProfile", "-ExecutionPolicy", "unrestricted", "-Command",
                "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; &([scriptblock]::Create((Invoke-WebRequest -UseBasicParsing 'https://dot.net/v1/dotnet-install.ps1')))"
            ])
            ps.stdout.on("data", data => console.log(data.toString()))
            ps.stderr.on("data", data => console.error(data.toString()))
            ps.on("exit", resolve)
            ps.stdin.end()
        } else {
            const bash = spawn("bash", [
                "-c", "curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin"
            ])
            bash.stdout.on("data", data => console.log(data.toString()))
            bash.stderr.on("data", data => console.error(data.toString()))
            bash.on("exit", resolve)
            bash.stdin.end()
        }
    })
}

function suggestSolutions() {
    console.log("\nPossible solutions")
    console.log("------------------\n")

    if (process.platform === "darwin") {
        console.log("* Install .NET Runtime using Homebrew:\n")
        console.log("    brew install dotnet\n")
    } else if (process.platform === "win32") {
        console.log("* Install .NET Runtime using Chocolatey:\n")
        console.log("    choco install dotnet\n")
    } else {
        console.log("* Install .NET Runtime using your package manager (Ubuntu):\n")
        console.log("    sudo apt-get install -y dotnet-runtime-6.0\n")
    }

    console.log("* Get .NET Runtime from Microsoft:\n")
    console.log("    https://dotnet.microsoft.com/download/dotnet-core/6.0\n")
}

module.exports = (filename, args) => {
    if (!args)
        args = []

    return new Promise(resolve => {
        const dotnet = getDotNetPath()

        if (dotnet) {
            if (filename)
                args.unshift(filename)

            spawn(dotnet, args, { stdio: "inherit" })
                .on("exit", resolve)
        } else {
            console.error("fatal: The 'dotnet' command was not found")

            if (!process.stdout.isTTY ||
                !readlineSync.keyInYN("\nDo you want to install .NET now?")) {
                suggestSolutions()
                resolve(0x7f)
            }

            installDotNet(result => {
                console.log("\n.NET installer completed:", result)

                const dotnet2 = getDotNetPath()

                if (dotnet2) {
                    if (filename)
                        args.unshift(filename)

                    spawn(dotnet2, args, { stdio: "inherit" })
                        .on("exit", resolve)
                } else {
                    suggestSolutions()
                    resolve(0x7e)
                }
            })
        }
    })
}

module.exports.getDotNetPath = getDotNetPath
module.exports.installDotNet = installDotNet
