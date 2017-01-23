/* Create the scene and basic camera. |||FOR LATER||| Build and render camera through OrthographicCamera class bassed on delta cube positioning provided from server */
var obj = this;	
var id = 1;
var camId = id + "Cam";
var cubeId = id + "Cube";
var camObjId = id + "CamObj";
var cubeObjId = id + "CubeObj";
var sceneObjId = id + "SceneObj";

obj[sceneObjId] = new THREE.Scene();
obj[camObjId] = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);	


/* Launch connection to socket.io server, wait for conection before loading */
obj[sceneObjId].socket = io.connect('http://localhost:8080');
obj[sceneObjId].socket.on('connect', function() { 
	console.log("connected!"); 
	
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

/* var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
scene.add(camera); */ // Ortho. Camera test

/* WebGL Renderer provided through three.js engine */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Base Grid, I am just gonna be using 100 by 10 to produce a line representing 2D grid in background */
var scale = 100; 
var sections = 10; 
var baseGrid = new THREE.GridHelper(scale, sections);
obj[sceneObjId].add(baseGrid);

var cWidth = obj[cubeId].w;
var cHeight = obj[cubeId].h;
var cDepth = obj[cubeId].d;
var cColor = obj[cubeId].color;
var camZ = obj[camId].z;

/* Cube dynamics and aesthetics */
var cubeColorRGB = new THREE.Color(cColor);
var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB });
obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeColor);

//scene.add(camera);
obj[sceneObjId].add(obj[cubeObjId]);
obj[camObjId].position.z = camZ;



/* Key Press -> Append 38, 40, 39, 37 key codes to a var speed = 10; -> server updated cube object constructor pos -> client recieves new x and y and renders camera / cube through camera.rotation.x camera.rotation.y camera.translateZ (for basic non orthographic camera class) -- cube.translateZ cube.translateY cube.translateX */
var render = function () {
	requestAnimationFrame(render);
	renderer.render(obj[sceneObjId], obj[camObjId]);
};

render();
	
	
	
document.onkeypress = function (e) {
	e = e || window.event;
	console.log(e.key);
	var xx = 0;
	var zz = 0;
	var speed = 2;
	
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
			
			obj[sceneObjId].socket.emit('updatePos', {
				'x': xx,
				'z': zz,
				'id': 1
			});
};

obj[sceneObjId].socket.on('move', function(data) {
	var newCamZ = data[0].z;
	var newCubeZ = data[1].z;
	
	var render = function () {
		requestAnimationFrame(render);		
		obj[cubeObjId].translateZ(newCubeZ);
		obj[camObjId].translateZ(newCamZ);	
		renderer.render(obj[sceneObjId], obj[camObjId]);
	};

	render();
	console.log("Moved!");
});
	
});
