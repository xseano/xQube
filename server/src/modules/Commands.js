var fs = require("fs");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

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

    switch(split[0].toLowerCase())
    {
        case "quit":
        case "credit":
        Logger.green("Authors: Sean Oberoi and Stas Darevskiy");
            break;
        case "exit":        
        var cntrlC = '^C';
        var child = exec(cntrlC, function(err, stdout, stderr) {if (err) throw err;});
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
