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
      //console.log(code + " || " + this.id);
      for(var u = 0; u < this.userList.length; u++) {
          var unmIDCube = this.userList[u].data.cubeID;
          var id = this.userList[u].id;
          if (id == this.id) {
            var ws = this.userList[u].socket;
            var deleteObj = new DeleteObject('rmClient', this.userList[u].data.uID);
            var d = this.uintIfy(deleteObj);

            this.webSock.clients.forEach(function each(client) {
              if (client != ws && client.readyState === 1) {
                client.send(d);
              }
            });

            this.userList.splice(this.userList[u], 1);
            console.log("Client with id: " + this.id + " has successfully been disconnected and destroyed!");
            //console.log("User List: " + this.userList);
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

          var xx = 0;
          var zz = 0;
          var speed = 4;
          var key = parsed.key;

          if (key == 'w') {
            zz -= speed;
          }

          if (key == 's') {
            zz += speed;
          }

          if (key == 'a') {
            xx -= speed;
          }

          if (key == 'd') {
            xx += speed;
          }

          var id = parsed.id;
          var camId = id + "Cam";
          var cubeId = id + "Cube";
          var uId = "user" + id;

          this.camID.x += xx;
          this.camID.z += zz;

          this.cubeID.x += xx;
          this.cubeID.z += zz;

         var moveObj = new MoveObject('move', this.uID);
         var u = this.uintIfy(moveObj);
         this.socket.send(u);
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
