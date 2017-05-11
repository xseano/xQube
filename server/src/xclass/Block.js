const CameraObject = require('../objects/CameraObject');
const CubeObject = require('../objects/CubeObject');
const CubeCollection = require('../objects/CubeCollection');
const MoveObject = require('../objects/MoveObject');
const DeleteObject = require('../objects/DeleteObject');
const ULObject = require('../objects/ULObject');
const ChatObject = require('../objects/ChatObject');
const CircularJSON = require('circular-json');
const BinaryReader = require('../lib/BinaryReader');
const BinaryWriter = require('../lib/BinaryWriter');
const cowsay = require('cowsay');
const colors = require('colors');
global.Logger = require('../modules/Logger');
global.Commands = require('../modules/Commands');
global.readline = require('readline');
global.rl = readline.createInterface(process.stdin, process.stdout);

class Block {

    constructor(id, ws, webSock, userList) {
        this.id = id;
        this.socket = ws;
        this.webSock = webSock;
        this.camID = new CameraObject(0, 0, 4);
        this.cubeID = new CubeObject(0, 0, 0, 5, 5, 5, "rgb(174, 129, 255)");
        this.uID = new CubeCollection(id, this.camID, this.cubeID);
        this.userList = userList;
    }

    onCloseConn(code, reason) {
      Logger.info("Client disconnect with code: " + code + " from IP: " + this.ip + "".green);

      if (code == 1001 || code == 1006) {
        for(var u = 0; u < this.userList.length; u++) {
            var unmIDCube = this.userList[u].cubeID;
            var id = this.userList[u].id;
            if (id == this.id) {
              var ws = this.userList[u].socket;
              var name = this.name;
              var color = this.cubeID.color;
              var obj = this;
              //var deleteObj = new DeleteObject('rmClient', this.userList[u].uID, this.name, this.cubeID.color);
              //var d = this.uintIfy(deleteObj);

              this.webSock.clients.forEach(function each(client) {
                if (client.readyState === 1) {
                  obj.rmClient(client, id, name);
                  //client.send(d);
                }
              });

              this.userList.splice(u, 1);
              console.log("Client with id: " + this.id + " has successfully been disconnected and destroyed!");
              //console.log("User List: " + this.userList);
            }
        }
      }
    }

    uintIfy(obj) {

    }

    sendNewPos() {

    }

    updatePos() {
      var writer = new BinaryWriter();
      writer.writeUInt8('m'.charCodeAt(0));
      writer.writeInt32(this.cubeID.x);
      writer.writeInt32(this.cubeID.z);
      writer.writeInt32(this.camID.x);
      writer.writeInt32(this.camID.z);
      this.socket.send(writer.toBuffer());
    }

    rmClient(client, id, name) {
      var writer = new BinaryWriter();
      writer.writeUInt8('r'.charCodeAt(0));
      writer.writeUInt8(id);

      for (var i = 0; i < name.length; i++) {
          writer.writeUInt16(name.charCodeAt(i));
      }

      client.send(writer.toBuffer());
    }

    setName(msg, reader, offset) {
      var name = "";
      var len = msg.byteLength;

      for (var i = offset; i < len; i++) {
        var letter = String.fromCharCode(reader.readUInt8());
        name += letter;
      }
      this.name = name;
    }

    setColor(msg, reader, offset) {

      var r = reader.readUInt16(offset, true);
      offset += 2;
      var g = reader.readUInt16(offset, true);
      offset += 2;
      var b = reader.readUInt16(offset, true);
      offset += 2;

      var rgb = ('rgb(' +
				r + ',' +
				g + ',' +
				b + ')'
			);

      this.cubeID.color = rgb;
      this.cubeID.r = r;
      this.cubeID.g = g;
      this.cubeID.b = b;
    }

    onMessage(msg) {

        var offset = 0;
        var reader = new BinaryReader(msg);
        var id = String.fromCharCode(reader.readUInt8());
        offset++;

        console.log('Recieved id: ' + id);

        var speed = 2;

        switch (id) {
          case 'w':
            this.cubeID.z -= speed;
            this.camID.z -= speed;
            this.updatePos();
            break;
          case 'a':
            this.cubeID.x -= speed;
            this.camID.x -= speed;
            this.updatePos();
            break;
          case 's':
            this.cubeID.z += speed;
            this.camID.z += speed;
            this.updatePos();
            break;
          case 'd':
            this.cubeID.x += speed;
            this.camID.x += speed;
            this.updatePos();
            break;
          case 'n':
            this.setName(msg, reader, offset);
            break;
          case 'c':
            this.setColor(msg, reader, offset);
            break;
        }

        /*

        var objUArr = new Uint8Array(msg);
        var objStr = this.reader.readArray(objUArr);
        var parsed = JSON.parse(objStr);
        var mID = parsed.id;

        if (mID == 'sendClientData') {
          this.name = parsed.name;
          this.cubeID.color = parsed.color;
        }

        if (mID == 'chatMessage') {
          var chatMsg = parsed.data;
          var chatObject = new ChatObject('chatObject', chatMsg, this.name, this.cubeID.color);
          var chatObjectArr = this.uintIfy(chatObject);
          this.webSock.clients.forEach(function each(client) {
            if (client.readyState === 1) {
              client.send(chatObjectArr);
            }
          });

        }

        if (mID == 'sendJSONObject') {
          var jsonObj = parsed.data;
        }

        if (mID == 'updateDate') {
          for (var ud = 0; ud < this.userList.length; ud++) {
            if (this.userList[ud].id == parsed.uid) {
              this.userList[ud].date = Date.now();
            }
          }
        }

        if (mID == 'updatePos') {

          var speed = 2;
          var completeTime = 4;
          var key = parsed.key;

          var initCamZPos = this.camID.z;
          var initCubeZPos = this.cubeID.z;
          var initCamXPos = this.camID.x;
          var initCubeXPos = this.cubeID.x;

          if (key == 'w') {
            var camDiff = ((initCamZPos + speed) - initCamZPos) / completeTime;
            var cubeDiff = ((initCubeZPos + speed) - initCubeZPos) / completeTime;
            this.updatePos(completeTime, camDiff, cubeDiff, 'w');
          }

          if (key == 's') {
            var camDiff = ((initCamZPos + speed) - initCamZPos) / completeTime;
            var cubeDiff = ((initCubeZPos + speed) - initCubeZPos) / completeTime;
            this.updatePos(completeTime, camDiff, cubeDiff, 's');
          }

          if (key == 'a') {
            var camDiff = ((initCamXPos + speed) - initCamXPos) / completeTime;
            var cubeDiff = ((initCubeXPos + speed) - initCubeXPos) / completeTime;
            this.updatePos(completeTime, camDiff, cubeDiff, 'a');
          }

          if (key == 'd') {
            var camDiff = ((initCamXPos + speed) - initCamXPos) / completeTime;
            var cubeDiff = ((initCubeXPos + speed) - initCubeXPos) / completeTime;
            this.updatePos(completeTime, camDiff, cubeDiff, 'd');
          }
        }

      if (mID == 'getUserList') {
        var ws = this.socket;
        var circJson = CircularJSON.stringify(this.userList);
        var ulobj = new ULObject('returnUserList', circJson);
        var ulobjarr = this.uintIfy(ulobj);
        this.webSock.clients.forEach(function each(client) {
          if (client.readyState === 1) {
            client.send(ulobjarr);
          }
        });
      }
      */
    }

    getCamID(id) {
      return id + "Cam";
    }

    getCubeID(id) {
      return id + "Cube";
    }

    getUID(id) {
      return "user" + id;
    }

}

module.exports = Block;
