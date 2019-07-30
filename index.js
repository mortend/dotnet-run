const path = require('path');
const {spawn} = require('child_process');

function dotnet_spawn(filename, args) {
    const mono = path.join(__dirname, 'mono');
    const options = {stdio: 'inherit'};

    if (path.sep == '\\')
        return spawn(filename, args, options);
    else {
        if (filename)
            args.unshift(filename);
        return spawn(mono, args, options);
    }
}

module.exports = (filename, args, callback) =>
    dotnet_spawn(filename, args).on('exit', callback);
