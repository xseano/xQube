/* Launch connection to socket.io server, wait for conection before loading */
var socket = io.connect('http://localhost:8080');
socket.on('connect', function() { console.log("connected!"); } );

/* Create the scene and basic camera. |||FOR LATER||| Build and render camera through OrthographicCamera class bassed on delta cube positioning provided from server */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);			

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
scene.add(baseGrid);

/* Cube dynamics and aesthetics */
var cubeColorRGB = new THREE.Color("rgb(174, 129, 255)");
var cubeGeom = new THREE.BoxGeometry(1, 1, 1);
var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB });
var cubeObj = new THREE.Mesh(cubeGeom, cubeColor);

//scene.add(camera);
scene.add(cubeObj);
camera.position.z = 4;

/* Key Press -> Append 38, 40, 39, 37 key codes to a var speed = 10; -> server updated cube object constructor pos -> client recieves new x and y and renders camera / cube through camera.rotation.x camera.rotation.y camera.translateZ (for basic non orthographic camera class) -- cube.translateZ cube.translateY cube.translateX */
var render = function () {
	requestAnimationFrame(render);
	
	/* Camera and Cube objects have to be translated by the same z-index value in order to not have the cube phase in or out */
	cubeObj.translateZ(2);
	camera.translateZ(2);
	
	renderer.render(scene, camera);
};

render();
