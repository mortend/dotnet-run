const run = require("..")
const path = require("path")
run(path.join(__dirname, "net6.0", "test.dll"), [], process.exit)
