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

    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint16Array(buf));
    }

    onMessage(msg) {
        var reader = new BinaryReader(msg);
        var id = reader.readUInt8();
        switch(id) {
            case 1:
                var abstr = reader.readUInt8();
                console.log('Received str: ' + String.fromCharCode(abstr));
                break;
            default:
                console.log("Unknown packet id: " + id + "!");
                break;
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
