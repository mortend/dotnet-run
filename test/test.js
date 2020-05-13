const run = require("..");
const path = require("path");
run(path.join(__dirname, "test.exe"), [], process.exit);
