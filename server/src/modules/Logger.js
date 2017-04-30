var fs = require("fs");
var util = require('util');
var EOL = require('os').EOL;
var log = "";

module.exports.toString = toString;
module.exports.debug = debug;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
module.exports.err = error;
module.exports.fatal = fatal;
module.exports.print = print;
module.exports.write = write;
module.exports.start = start;
module.exports.prompt = prompt;
module.exports.clear = clear;
module.exports.green = green;
module.exports.white = white;

function toString()
{
    return log;
}

function debug(message) {
    message = util.format(message);
    writeCon(colorWhite, "[DEBUG] " + message);
    writeLog("[DEBUG][" + getTimeString() + "] " + message);
};

function info(message) {
    message = util.format(message);
    writeCon(colorWhite + colorBright, "[INFO ] " + message);
    writeLog("[INFO ][" + getTimeString() + "] " + message);
};

function warn(message) {
    message = util.format(message);
    writeCon(colorYellow + colorBright, "[WARN ] " + message);
    writeLog("[WARN ][" + getTimeString() + "] " + message);
};

function error(message) {
    message = util.format(message);
    writeCon(colorRed + colorBright, "[ERROR] " + message);
    writeLog("[ERROR][" + getTimeString() + "] " + message);
};

function fatal(message) {
    message = util.format(message);
    writeCon(colorRed + colorBright, "[FATAL] " + message);
    writeLog("[FATAL][" + getTimeString() + "] " + message);
};

function print(message) {
    message = util.format(message);
    writeCon(colorWhite, message);
    writeLog("[NONE ][" + getTimeString() + "] " + message);
};

function write(message) {
    message = util.format(message);
    writeLog("[NONE ][" + getTimeString() + "] " + message);
};

function green(message) {
    message = util.format(message);
    writeCon(colorGreen + colorBright, message);
};

function white(message) {
    message = util.format(message);
    writeCon(colorWhite + colorBright, message);
};

function getDateTimeString() {
    var date = new Date();
    var dy = date.getFullYear();
    var dm = date.getMonth();
    var dd = date.getDay();
    var th = date.getHours();
    var tm = date.getMinutes();
    var ts = date.getSeconds();
    var tz = date.getMilliseconds();
    dy = ("0000" + dy).slice(-4);
    dm = ("00" + dm).slice(-2);
    dd = ("00" + dd).slice(-2);
    th = ("00" + th).slice(-2);
    tm = ("00" + tm).slice(-2);
    ts = ("00" + ts).slice(-2);
    tz = ("000" + tz).slice(-3);
    return dy + "-" + dm + "-" + dd + "T" + th + "-" + tm + "-" + ts + "-" + tz;
};

function getTimeString() {
    var date = new Date();
    var th = date.getHours();
    var tm = date.getMinutes();
    var ts = date.getSeconds();
    th = ("00" + th).slice(-2);
    tm = ("00" + tm).slice(-2);
    ts = ("00" + ts).slice(-2);
    return th + "-" + tm + "-" + ts;
};

function prompt(callback)
{
    rl.setPrompt("# ");
    rl.question('# ', callback);
}

function clear()
{
    log = "";
    process.stdout.write("\033c");
    readline.cursorTo(process.stdout, 0);
    process.stdout.write("\r\x1b[K");
    readline.clearLine(process.stdout, 0);
    log = "";
}

function writeCon(color, message) {
    log += message + "\u001B[0m" + EOL;
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(color + message + "\u001B[0m" + EOL);
    rl.prompt(true);
};

function writeLog(message) {
    //Do nothing!!! lmao xd
};

function start() {
    if (consoleLog != null)
        return;
    var timeString = getDateTimeString();
    var fileName = logFolder + "/" + logFileName + ".log";
    var fileName2 = logBackupFolder + "/" + logFileName + "-" + timeString + ".log";
    console.log = function (message) { print(message); };
}

var logFolder = "./logs";
var logBackupFolder = "./logs/LogBackup";
var logFileName = "xQube";

var consoleLog = null;
var colorBlack = "\u001B[30m";
var colorRed = "\u001B[31m";
var colorGreen = "\u001B[32m";
var colorYellow = "\u001B[33m";
var colorBlue = "\u001B[34m";
var colorMagenta = "\u001B[35m";
var colorCyan = "\u001B[36m";
var colorWhite = "\u001B[37m";
var colorBright = "\u001B[1m";
