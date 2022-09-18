const { spawn } = require("child_process")

module.exports = (filename, args, callback) => {
    if (filename)
        args.unshift(filename)

    spawn("dotnet", args, { stdio: "inherit" })
        .on("exit", callback)
}
