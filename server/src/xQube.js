const WebSocket = require('ws');
var obj = this;
const Block = require('./modules/Block');
const cowsay = require('cowsay');
const colors = require('colors');
global.Logger = require('./modules/Logger');
global.Commands = require('./modules/Commands');
global.readline = require('readline');
global.rl = readline.createInterface(process.stdin, process.stdout);
var userList = [];

class xServer {

constructor() {
  this.id = 1;
}

xQube() {
    this.commands = new Commands(this).start();
}

start() {

    const webSock = new WebSocket.Server({perMessageDeflate: false, port: 8080}, this.onStart.bind(this));
    webSock.on('connection', this.onConnection.bind(this));
    Logger.white(cowsay.say({
        text : "x³ ( xQube )",
        e : "oO",
        T : "U "
    }));

    Logger.prompt(this.handleCommand.bind(this));
    Logger.info("x³ authors: Sean Oberoi and Stas Darevskiy ".green);
    Logger.info("Copyright (c) 2016-2017 Mile High Interactive, LLC".green);
}

handleCommand(data) {
	this.commands.parse(data);
	Logger.prompt(this.handleCommand.bind(this));
}

onConnection(ws) {
  var client = new Block(this.getNextID(), ws);
  client.ip = ws.upgradeReq.connection.remoteAddress;
  client.socket.on('message', client.onMessage.bind(client));

  var id = client.id;
  userList.push(id);

  console.log("Built new Cube Object with ID: " + client.uID.id) + "\n";

  console.log("UserList: " + userList);
}

onStart() {
  Logger.info("WebSocket server successfully deployed!".green);
}

getNextID() {
  return this.id++;
}

}

module.exports = xServer;
