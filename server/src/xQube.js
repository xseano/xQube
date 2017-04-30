const WebSocket = require('ws');
var obj = this;
const Block = require('./xclass/Block');
const Subscriber = require('./objects/Subscriber');
const cowsay = require('cowsay');
const colors = require('colors');
global.Logger = require('./modules/Logger');
global.Commands = require('./modules/Commands');
global.readline = require('readline');
global.rl = readline.createInterface(process.stdin, process.stdout);

class xServer {

constructor(confData) {
  this.id = 1;
  if (confData['isDevEnv'] == true) {
    this.webSock = new WebSocket.Server({perMessageDeflate: false, port: confData['wsPortDev']}, this.onStart.bind(this));
  } else if (confData['isDevEnv'] == false) {
    this.webSock = new WebSocket.Server({perMessageDeflate: false, port: confData['wsPort']}, this.onStart.bind(this));
  }
  this.userList = [];
}

xQube() {
    this.commands = new Commands(this).start();
}

start() {

    this.webSock.on('connection', this.onConnection.bind(this));
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
  var client = new Block(this.getNextID(), ws, this.webSock, this.userList);
  client.ip = ws.upgradeReq.connection.remoteAddress;
  client.socket.on('message', client.onMessage.bind(client));
  client.socket.on('close', client.onCloseConn.bind(client));

  var id = client.id;
  this.userList.push({'id': client.uID.id, 'data': client});

  Logger.info("ID: " + client.uID.id + " with IP: "  + client.ip + "".white);

  var subObj = new Subscriber('create', client.camID, client.cubeID, client.uID);
  var user = client.uintIfy(subObj);
  client.socket.send(user);

  console.log("UserList: " + this.userList);
}

onStart() {
  Logger.info("WebSocket server successfully deployed!".green);
}

getNextID() {
  return this.id++;
}

}

module.exports = xServer;
