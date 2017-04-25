const BinaryReader = require('../lib/BinaryReader');
const CameraObject = require('./CameraObject');
const CubeObject = require('./CubeObject');
const CubeCollection = require('./CubeCollection');

class Block {

    constructor(id, ws) {
        this.id = id;
        this.socket = ws;
        this.camID = new CameraObject(0, 0, 4);
        this.cubeID = new CubeObject(0, 0, 0, 5, 5, 5, "rgb(174, 129, 255)");
        this.uID = new CubeCollection(id, this.getCamID(id), this.getCubeID(id));
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
        //var reader = new BinaryReader(msg);
        //var id = reader.readUInt8();

        console.log(msg);

        //var objUArr = new Uint8Array(msg); // Uint8Array[xyx, yzx, yxz, zyx]
        var objStr = this.ab2str(msg); // "{'x': '1'}"
        var jsonObj = JSON.parse(objStr); // {'x': '1'}

        console.log(jsonObj.x); // 1

        //console.log('Received obj: ' + String.fromCharCode(abstr));
        /*
        switch(id) {
            case 1:
                var abstr = reader.readUInt8();
                console.log('Received str: ' + String.fromCharCode(abstr));
                break;
            default:
                console.log("Unknown packet id: " + id + "!");
                break;
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
