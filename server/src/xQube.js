const WebSocket = require('ws');
const Block = require('./xclass/Block');
const Subscriber = require('./objects/Subscriber');
const BinaryReader = require('./lib/BinaryReader');
const BinaryWriter = require('./lib/BinaryWriter');
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

createClient(client) {
  var writer = new BinaryWriter();
  writer.writeUInt8('c'.charCodeAt(0));
  writer.writeUInt32(client.id);
  writer.writeUInt32(client.cubeID.x);
  writer.writeUInt32(client.cubeID.z);
  writer.writeUInt32(client.cubeID.w);
  writer.writeUInt32(client.cubeID.h);
  writer.writeUInt32(client.cubeID.d);
  writer.writeUInt32(client.camID.x);
  writer.writeUInt32(client.camID.z);
  client.socket.send(writer.toBuffer());
}

onConnection(ws) {
  var client = new Block(this, this.getNextID(), ws, this.webSock, this.userList);
  client.ip = ws.upgradeReq.connection.remoteAddress;
  client.socket.on('message', client.onMessage.bind(client));
  client.socket.on('close', client.onCloseConn.bind(client));

  var id = client.id;

  this.createClient(client);
  this.userList.push(client);
  //client.returnUList();

  Logger.info("ID: " + client.uID.id + " with IP: "  + client.ip + "".white);
}

onStart() {
  Logger.info("WebSocket server successfully deployed!".green);
}

getNextID() {
  return this.id++;
}

}

module.exports = xServer;
