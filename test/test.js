const run = require("../lib");
const path = require("path");
run(path.join(__dirname, "test.exe"), [], process.exit);
