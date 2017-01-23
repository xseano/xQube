var obj = this;	
var id = getRandomInt(1, 1000);
var camId = id + "Cam";
var cubeId = id + "Cube";
var camObjId = id + "CamObj";
var cubeObjId = id + "CubeObj";
var sceneObjId = id + "SceneObj";

obj[sceneObjId] = new THREE.Scene();
obj[camObjId] = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); //new THREE.CubeCamera( 1, 100000, 128 );	
//obj[sceneObjId].add( obj[camObjId] );

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

var scale = 100; 
var sections = 10; 
var baseGrid = new THREE.GridHelper(scale, sections);
obj[sceneObjId].add(baseGrid);

var cWidth = obj[cubeId].w;
var cHeight = obj[cubeId].h;
var cDepth = obj[cubeId].d;
var cColor = obj[cubeId].color;
var camZ = obj[camId].z;

var cubeColorRGB = new THREE.Color(cColor);
var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB/*, envMap: obj[camObjId].renderTarget*/ });
obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeColor);

obj[sceneObjId].add(obj[cubeObjId]);
obj[camObjId].position.z = camZ;

var render = function () {
	requestAnimationFrame(render);
	
	/* Cube Camera Implementation for later 
	obj[camObjId].position.copy( obj[cubeObjId].position );
	obj[camObjId].updateCubeMap( renderer, obj[sceneObjId] );
	*/
	
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
			obj[cubeObjId].position.z = newCubeZ;
			obj[camObjId].position.z = newCamZ;
			//obj[cubeObjId].position.x = newCubeX;
			//obj[camObjId].position.x = newCamX;
			
			/* Cube Camera Implementation for later 
			obj[camObjId].position.copy( obj[cubeObjId].position );
			obj[camObjId].updateCubeMap( renderer, obj[sceneObjId] );
			*/
			
			renderer.render(obj[sceneObjId], obj[camObjId]);
		};

		render();
	});
	
});
