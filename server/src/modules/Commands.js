function Commands(xQube) {
    this.xQube = xQube;
}

Commands.prototype.parse = function(command) {
    var split = command.split(" ");
    var rest = "";
    for (var i = 1; i < split.length; i++)
    {
        rest += split[i] + " ";
    }
    rest = rest.substr(0, rest.length - 1);

    // Regular Commands
    switch(split[0].toLowerCase())
    {
        case "quit":
        case "test":
        Logger.green("Wus poppin B");
            break;
        case "exit":
            this.world.exit();
            break;
        case "?":
        case "help":
            Logger.green("?:");
            Logger.green("Help:");
            Logger.white("   - This command")
            Logger.green("Quit:");
            Logger.green("Exit:");
            Logger.white("   - Shutdown the server");
            Logger.green("Clear:");
            Logger.white("  - Clear the console window");
                break;
            case "clear":
                this.clear();
                break;
            default:
                Logger.error("Unknown Command!");
                break;
    }
}

Commands.prototype.start = function() {
    return this;
}

Commands.prototype.clear = function() {
    Logger.clear();
}

module.exports = Commands;
