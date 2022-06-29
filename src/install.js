const path = require('path');
const {spawn} = require('child_process');

if (path.sep == '\\') {
    // Windows has .NET built-in.
    console.log("using built-in .NET Framework on Windows");
    process.exit(0);
}

// Run Mono install script.
spawn('bash', [
    path.join(__dirname, 'install.bash')
], {
    stdio: 'inherit'
}).on('exit', () => {
    // Always return 0 -- don't want 'npm install' to fail.
    process.exit(0);
});
