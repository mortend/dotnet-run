const run = require("..")
const path = require("path")
const filename = path.join(__dirname, "net6.0", "test.dll")
run(filename).then(process.exit)
