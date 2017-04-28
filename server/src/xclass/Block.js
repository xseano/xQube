const BinaryReader = require('../lib/BinaryReader');
const CameraObject = require('../objects/CameraObject');
const CubeObject = require('../objects/CubeObject');
const CubeCollection = require('../objects/CubeCollection');
const MoveObject = require('../objects/MoveObject');
const DeleteObject = require('../objects/DeleteObject');
const ULObject = require('../objects/ULObject');

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

    str2ab(str) {
        var escstr = encodeURIComponent(str);
        var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        });
        var ua = new Uint8Array(binstr.length);
        Array.prototype.forEach.call(binstr, function (ch, i) {
            ua[i] = ch.charCodeAt(0);
        });
        return ua;
    }

    onCloseConn(code, reason) {
      console.log('Received closing code: ' + code + ' from client (id): ' + this.id);
      if (code == 1006) {
        for(var u = 0; u < this.userList.length; u++) {
            var unmIDCube = this.userList[u].data.cubeID;
            var id = this.userList[u].id;
            if (id == this.id) {
              var ws = this.userList[u].socket;
              var deleteObj = new DeleteObject('rmClient', this.userList[u].data.uID);
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
    	var stringifiedObj = JSON.stringify(obj); // "{'x': '1'}"
    	var abObj = this.str2ab(stringifiedObj); // Uint8Array[xyx, yzx, yxz, zyx]
      var objUArr = new Uint8Array(abObj);
    	return objUArr;
    }

    ab2str(ab) {
        var binstr = Array.prototype.map.call(ab, function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        var escstr = binstr.replace(/(.)/g, function (m, p) {
            var code = p.charCodeAt(0).toString(16).toUpperCase();
            if (code.length < 2) {
                code = '0' + code;
            }
            return '%' + code;
        });
        return decodeURIComponent(escstr);
    }

    updatePos(completeTime, camDiff, cubeDiff, type) {
      var newCamPos = camDiff * completeTime;
      var newCubePos = cubeDiff * completeTime;

      for (var cam = camDiff; cam < newCamPos; cam++) {
        if (type == 'w') {
          this.cubeID.z -= camDiff;
          this.sendNewPos();
        }

        if (type == 'a') {
          this.cubeID.x -= camDiff;
          this.sendNewPos();
        }

        if (type == 's') {
          this.cubeID.z += camDiff;
          this.sendNewPos();
        }

        if (type == 'd') {
          this.cubeID.x += camDiff;
          this.sendNewPos();
        }
      }

      for (var cube = cubeDiff; cube < newCubePos; cube++) {
        if (type == 'w') {
          this.camID.z -= cubeDiff;
          this.sendNewPos();
        }

        if (type == 'a') {
          this.camID.x -= cubeDiff;
          this.sendNewPos();
        }

        if (type == 's') {
          this.camID.z += cubeDiff;
          this.sendNewPos();
        }

        if (type == 'd') {
          this.camID.x += cubeDiff;
          this.sendNewPos();
        }
      }
    }

    sendNewPos() {
      var moveObj = new MoveObject('move', this.uID);
      var u = this.uintIfy(moveObj);
      this.socket.send(u);
    }

    onMessage(msg) {

        var objUArr = new Uint8Array(msg);
        var objStr = this.ab2str(objUArr);
        var parsed = JSON.parse(objStr);
        var mID = parsed.id;

        console.log('Got incoming id... ' + mID);

        if (mID == 'sendJSONObject') {
          var jsonObj = parsed.data;
        }

        if (mID == 'updatePos') {

          var id = parsed.id;
          var camId = id + "Cam";
          var cubeId = id + "Cube";
          var uId = "user" + id;

          var xx = 0;
          var zz = 0;
          var speed = 2;
          var key = parsed.key;

          var initCamZPos = this.camID.z;
          var initCubeZPos = this.cubeID.z;
          var initCamXPos = this.camID.x;
          var initCubeXPos = this.cubeID.x;

          var nCamZPos = this.camID.z;
          var nCubeZPos = this.cubeID.z;
          var nCamXPos = this.camID.x;
          var nCubeXPos = this.cubeID.x;

          var completeTime = 2;

          if (key == 'w') {
            var camDiff = ((initCamZPos - speed) - initCamZPos) / completeTime;
            var cubeDiff = ((initCubeZPos - speed) - initCubeZPos) / completeTime;
            //this.camID.z -= speed;
            //this.cubeID.z -= speed;
            this.updatePos(completeTime, camDiff, cubeDiff, 'w');
          }

          if (key == 's') {
            var camDiff = ((initCamZPos + speed) - initCamZPos) / completeTime;
            var cubeDiff = ((initCubeZPos + speed) - initCubeZPos) / completeTime;
            //this.camID.z += speed;
            //this.cubeID.z += speed;
            this.updatePos(completeTime, camDiff, cubeDiff, 's');
          }

          if (key == 'a') {
            var camDiff = ((initCamXPos - speed) - initCamXPos) / completeTime;
            var cubeDiff = ((initCubeXPos - speed) - initCubeXPos) / completeTime;
            //this.camID.x -= speed;
            //this.cubeID.x -= speed;
            this.updatePos(completeTime, camDiff, cubeDiff, 'a');
          }

          if (key == 'd') {
            var camDiff = ((initCamXPos + speed) - initCamXPos) / completeTime;
            var cubeDiff = ((initCubeXPos + speed) - initCubeXPos) / completeTime;
            //this.camID.x += speed;
            //this.cubeID.x += speed;
            this.updatePos(completeTime, camDiff, cubeDiff, 'd');
          }
        }

      if (mID == 'getUserList') {
        var ws = this.socket;

        for(var u = 0; u < this.userList.length; u++) {
            var unmIDCube = this.userList[u].data.cubeID;
            var id = this.userList[u].id;
            var ulobj = new ULObject('returnUserList', id, unmIDCube);
            var ulobjarr = this.uintIfy(ulobj);
            this.webSock.clients.forEach(function each(client) {
              if (client.readyState === 1) {
                client.send(ulobjarr);
              }
            });
        }
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
