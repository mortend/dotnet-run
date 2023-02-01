declare module "dotnet-run" {

    /** Run a dotnet assembly */
    function run(filename: string | undefined, args: string[], callback: (result?: number) => void): void

    /** Get a full path to the 'dotnet' command, or undefined if not found */
    function getDotNetPath(): string | undefined

    /** Run the dotnet install script */
    function installDotNet(callback: (result?: number) => void): void

    run.getDotNetPath = getDotNetPath
    run.installDotNet = installDotNet
    export = run
}
