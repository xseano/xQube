const CameraObject = require('../objects/CameraObject');
const CubeObject = require('../objects/CubeObject');
const CubeCollection = require('../objects/CubeCollection');
const MoveObject = require('../objects/MoveObject');
const DeleteObject = require('../objects/DeleteObject');
const ULObject = require('../objects/ULObject');
const ChatObject = require('../objects/ChatObject');
const CircularJSON = require('circular-json');
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
              var deleteObj = new DeleteObject('rmClient', this.userList[u].uID, this.name, this.cubeID.color);
              var d = this.uintIfy(deleteObj);

              this.webSock.clients.forEach(function each(client) {
                if (client.readyState === 1) {
                  client.send(d);
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
    	var stringifiedObj = JSON.stringify(obj);
    	var abObj = this.writer.writeArray(stringifiedObj);
      var objUArr = new Uint8Array(abObj);
    	return objUArr;
    }

    updatePos(completeTime, camDiff, cubeDiff, type) {
      var newCamPos = camDiff * completeTime;
      var newCubePos = cubeDiff * completeTime;

        if (type == 'w') {
          this.cubeID.z -= newCubePos;
          this.sendNewPos();
        }

        if (type == 'a') {
          this.cubeID.x -= newCubePos;
          this.sendNewPos();
        }

        if (type == 's') {
          this.cubeID.z += newCubePos;
          this.sendNewPos();
        }

        if (type == 'd') {
          this.cubeID.x += newCubePos;
          this.sendNewPos();
        }

        if (type == 'w') {
          this.camID.z -= newCamPos;
          this.sendNewPos();
        }

        if (type == 'a') {
          this.camID.x -= newCamPos;
          this.sendNewPos();
        }

        if (type == 's') {
          this.camID.z += newCamPos;
          this.sendNewPos();
        }

        if (type == 'd') {
          this.camID.x += newCamPos;
          this.sendNewPos();
        }
    }

    sendNewPos() {
      var moveObj = new MoveObject('move', this.uID);
      var u = this.uintIfy(moveObj);
      this.socket.send(u);
    }

    onMessage(msg) {
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
