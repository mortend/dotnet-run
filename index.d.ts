/** Run a dotnet assembly */
declare async function runDotNet(filename: string | undefined, args?: string[]): Promise<number?>

/** Sub functions */
declare namespace runDotNet {
    /** Get a full path to the 'dotnet' command, or undefined if not found */
    function getDotNetPath(): string | undefined

    /** Run the dotnet install script */
    async function installDotNet(): Promise<number?>
}

export = runDotNet
