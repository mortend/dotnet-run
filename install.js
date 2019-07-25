const path = require('path');
const {spawn} = require('child_process');

if (path.sep == '\\') {
    // Windows has .NET built-in.
    process.exit(0);
}

// Run Mono install script.
spawn('bash', [
    path.join(__dirname, 'install.bash')
], {
    stdio: 'inherit'
}).on('exit', process.exit);
