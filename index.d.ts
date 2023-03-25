/** Run a dotnet assembly */
declare function run(filename: string | undefined, args?: string[]): Promise<number>

/** Sub functions */
declare namespace run {
    /** Get a full path to the 'dotnet' command, or undefined if not found */
    function getDotNetPath(): string | undefined

    /** Run the dotnet install script */
    function installDotNet(): Promise<number>
}

export = run
