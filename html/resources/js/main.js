var ip = "ws://127.0.0.1:8080";

var obj = this;
const id = getRandomInt(1, 65355);
var sceneObjId = id + "SceneObj";
const cameraHeight = 55; // Controls FOV on Cube in context of the plane
const cameraAngle = 72; // Controls Angle at which camera points towards cube

function SceneObj(id) {
		this.id = id;
    this.socket = new WebSocket(ip);
    this.scene = new THREE.Scene();
}

obj[sceneObjId] = new SceneObj(id);
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

	var socketID = obj[sceneObjId].id;
	var camObjId = socketID + "CamObj";
	var cubeObjId = socketID + "CubeObj";

	obj[camObjId] = new THREE.PerspectiveCamera(105, window.innerWidth/window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var scale = 2000;
	var sections = 200;
	var baseGrid = new THREE.GridHelper(scale, sections);
	obj[sceneObjId].scene.add(baseGrid);

	var cWidth = 5;
	var cHeight = 5;
	var cDepth = 5;
	var cColor = "rgb(174, 129, 255)";
	var camZ = 4;

	var cubeColorRGB = new THREE.Color(cColor);
	var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
	var txtrLder = new THREE.TextureLoader();

	var dice1 = txtrLder.load( './resources/images/DiceFace_1.png' );
	var dice2 = txtrLder.load( './resources/images/DiceFace_2.png' );
	var dice3 = txtrLder.load( './resources/images/DiceFace_3.png' );
	var dice4 = txtrLder.load( './resources/images/DiceFace_4.png' );
	var dice5 = txtrLder.load( './resources/images/DiceFace_5.png' );
	var dice6 = txtrLder.load( './resources/images/DiceFace_6.png' );

	var cubeMaterials = [
		new THREE.MeshBasicMaterial( { map: dice1 } ),
		new THREE.MeshBasicMaterial( { map: dice2 } ),
		new THREE.MeshBasicMaterial( { map: dice3 } ),
		new THREE.MeshBasicMaterial( { map: dice4 } ),
		new THREE.MeshBasicMaterial( { map: dice5 } ),
		new THREE.MeshBasicMaterial( { map: dice6 } )
	];

	var cubeFaces = new THREE.MeshFaceMaterial(cubeMaterials);
	//var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: 0.7, transparent: true });
	var group = new THREE.Group();
	obj[sceneObjId].scene.add(group);
	obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeFaces);
	obj[cubeObjId].name = socketID;
	group.add(obj[cubeObjId]);
	obj[sceneObjId].scene.add(obj[cubeObjId]);

	obj[cubeObjId].position.set(0, 10, camZ);
	obj[camObjId].position.y = cameraHeight;
	obj[camObjId].rotation.x = -(cameraAngle * Math.PI / 180);
	obj[camObjId].position.x = 0;
	obj[camObjId].position.z = camZ;


	var render = function () {
		requestAnimationFrame(render);
		renderer.render(obj[sceneObjId].scene, obj[camObjId]);
		//obj[sceneObjId].socket.emit('getUserList');
	};

	render();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
