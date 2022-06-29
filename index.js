const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

module.exports = (filename, args, callback) => {
    const options = {stdio: 'inherit'};

    if (path.sep == '\\')
        spawn(filename, args, options).on('exit', callback);
    else {
        if (filename)
            args.unshift(filename);

        const home = process.env.DOTNET_RUN_HOME ||
                     path.join(process.env.HOME, '.dotnet-run');
        const mono = path.join(home, '.bin', 'mono');

        if (fs.existsSync(mono))
            spawn(mono, args, options).on('exit', callback);
        else {
            // Fallback to install script.
            spawn('bash', [
                path.join(__dirname, 'src', 'install.bash')
            ], {
                stdio: 'inherit'
            }).on('exit', code => {
                if (code == 0)
                    spawn(mono, args, options).on('exit', callback);
                else if (callback)
                    callback(code)
            });
        }
    }
}
