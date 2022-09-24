const which = require("which")
const { spawn } = require("child_process")

function getDotNetPath() {
    for (const dotnet of which.sync("dotnet", {
        all: true,
        nothrow: true
    }) || []) {
        return dotnet
    }
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

module.exports = (filename, args, callback) => {
    const dotnet = getDotNetPath()

    if (dotnet) {
        if (filename)
            args.unshift(filename)

        spawn(dotnet, args, { stdio: "inherit" })
            .on("exit", callback)
    } else {
        console.error("fatal: The 'dotnet' command was not found")
        suggestSolutions()
        callback(0x7f)
    }
}
