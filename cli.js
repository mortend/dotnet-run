#!/usr/bin/env node
const run = require("./");
run(process.argv[2], process.argv.slice(3), process.exit);
