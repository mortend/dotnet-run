const path = require('path');
const {spawn} = require('child_process');

function dotnet_spawn(filename, args) {
    const clr = path.join(__dirname, 'dotnet-run');
    const options = {stdio: 'inherit'};

    if (path.sep == '\\')
        return spawn(filename, args, options);
    else {
        args.unshift(filename);
        return spawn(clr, args, options);
    }
}

module.exports = (filename, args, callback) =>
    dotnet_spawn(filename, args).on('exit', callback);
