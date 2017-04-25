var ip = "ws://127.0.0.1:8080";

var obj = this;
var id = getRandomInt(1, 65355);
var sceneObjId = id + "SceneObj";
const cameraHeight = 55; // Controls FOV on Cube in context of the plane
const cameraAngle = 72; // Controls Angle at which camera points towards cube

function SceneObj() {
    this.socket = new WebSocket(ip);
    this.scene = new THREE.Scene();
}

obj[sceneObjId] = new SceneObj();
var ws = obj[sceneObjId].socket;
var sceneColor = new THREE.Color("rgb(174, 129, 255)");

function onLoad() {
    ws.binaryType = "arraybuffer";

    ws.onopen = open;
    ws.onclose = close;
    ws.onerror = close;
    //ws.onmessage = message;
		window.bodyDiv = document.getElementById("bodyDiv");
		bodyDiv.innerHTML = '<center><span class="textMsg"> ~ x³ ~ </span><br><br><br><span class="textMsg">xQube is Connecting...</span><br></center>';

		if (ws.readyState == 1) {
			open();
		}
}

function close() {
	bodyDiv.innerHTML = '<center><span class="textMsg"> ~ x³ ~ </span><br><br><br><span class="textMsg">xQube failed to connect...</span><br></center>';
}

function createBuffer(size) {
    return new DataView(new ArrayBuffer(size))
}

function sendBuffer(dataview) {
    ws.send(dataview.buffer)
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function sendString(str) {
    var buffer = createBuffer(2);
    var offset = 0;
    buffer.setUint8(offset++, 1);
		buffer.setUint8(offset++, str.charCodeAt(0));
    sendBuffer(buffer);
}

function open() {
	bodyDiv.innerHTML = '';
	sendString('h');
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
