/** Run a dotnet assembly */
declare function runDotNet(filename: string | undefined, args: string[], callback: (result?: number) => void): void

/** Sub functions */
declare namespace runDotNet {
    /** Get a full path to the 'dotnet' command, or undefined if not found */
    function getDotNetPath(): string | undefined

    /** Run the dotnet install script */
    function installDotNet(callback: (result?: number) => void): void
}

export = runDotNet
