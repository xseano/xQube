var obj = this;	
var id = getRandomInt(1, 1000);
var camId = id + "Cam";
var cubeId = id + "Cube";
var camObjId = id + "CamObj";
var cubeObjId = id + "CubeObj";
var sceneObjId = id + "SceneObj";

obj[sceneObjId] = new THREE.Scene();
obj[camObjId] = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

obj[sceneObjId].socket = io.connect('http://localhost:8080');
obj[sceneObjId].socket.on('connect', function() { 	
	
	function CubeObject(x, y, z, w, h, d, color) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.h = h;
		this.d = d;
		this.color = color;
	}

	function CameraObject(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	obj[sceneObjId].socket.emit("newObj", {
		"id": id
	});
	
	obj[camId] = new CameraObject(0, 0, 4);
	obj[cubeId] = new CubeObject(0, 0, 0, 1, 1, 1, "rgb(174, 129, 255)");

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scale = 200; 
var sections = 20; 
var fogGrid = new THREE.Fog(0x00ff00, 1, 5);
var baseGrid = new THREE.GridHelper(scale, sections);
obj[sceneObjId].add(baseGrid);

var cWidth = obj[cubeId].w;
var cHeight = obj[cubeId].h;
var cDepth = obj[cubeId].d;
var cColor = obj[cubeId].color;
var camZ = obj[camId].z;

var cubeColorRGB = new THREE.Color(cColor);
var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: 0.7, transparent: true });
var group = new THREE.Group();
obj[sceneObjId].add( group );
obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeColor);
group.add(obj[cubeObjId]);

obj[sceneObjId].add(obj[cubeObjId]);
obj[camObjId].position.set(0, 12, camZ);
obj[cubeObjId].position.set(0, 10, 0);
obj[camObjId].lookAt(new THREE.Vector3(0, 12, -10));


var render = function () {
	requestAnimationFrame(render);
	renderer.render(obj[sceneObjId], obj[camObjId]);
};

render();
	
	
	
document.onkeypress = function (e) {
	e = e || window.event;
	var xx = 0;
	var zz = 0;
	var speed = 20;

	if (e.key == 'w') {
		zz = -speed;
	}
	
	if (e.key == 's') {
		
		zz = speed;
	}
	
	if (e.key == 'a') {
		xx = -speed;
	}
	
	if (e.key == 'd') {
		xx = speed;
	}
	console.log(id);
	
	obj[sceneObjId].socket.emit('updatePos', {
		'x': xx,
		'z': zz,
		'id': id
	});
			
};

obj[sceneObjId].socket.on('move', function(data) {
		var newCamZ = data.CamObj.z;
		var newCubeZ = data.CubeObj.z;

		var newCamX = data.CamObj.x;
		var newCubeX = data.CubeObj.x;

		var render = function () {
			requestAnimationFrame(render);			
			obj[cubeObjId].position.set(newCamX, 10, newCubeZ);
			obj[camObjId].position.set(newCamX, 12, newCamZ);
			obj[camObjId].up = new THREE.Vector3(0, 12, newCamZ);
			renderer.render(obj[sceneObjId], obj[camObjId]);
		};

		render();
	});
	
});
