var obj = this;	
var id = getRandomInt(1, 65355);
var sceneObjId = id + "SceneObj";
obj[sceneObjId] = new THREE.Scene();
obj[sceneObjId].socket = io.connect('http://localhost:8080');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

obj[sceneObjId].socket.on('connect', function() { 
	var socketID = obj[sceneObjId].socket.id;
	var camObjId = socketID + "CamObj";
	var cubeObjId = socketID + "CubeObj";
	
	obj[camObjId] = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
	
	obj[sceneObjId].socket.emit("newObj", {
		"id": socketID
	});
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var scale = 200; 
	var sections = 20; 
	var fogGrid = new THREE.Fog(0x00ff00, 1, 5);
	var baseGrid = new THREE.GridHelper(scale, sections);
	obj[sceneObjId].add(baseGrid);

	var cWidth = 1;
	var cHeight = 1;
	var cDepth = 1;
	var cColor = "rgb(174, 129, 255)";
	var camZ = 4;

	var cubeColorRGB = new THREE.Color(cColor);
	var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
	var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: 0.7, transparent: true });
	var group = new THREE.Group();
	obj[sceneObjId].add(group);
	obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeColor);
	obj[cubeObjId].name = socketID;
	group.add(obj[cubeObjId]);
	obj[sceneObjId].add(obj[cubeObjId]);

	obj[camObjId].position.set(0, 8, camZ);
	obj[cubeObjId].position.set(0, 7, 0);
	obj[camObjId].lookAt(new THREE.Vector3(0, 8, 0));


	var render = function () {
		requestAnimationFrame(render);
		renderer.render(obj[sceneObjId], obj[camObjId]);
	};

	render();
		
		
	document.onkeypress = function (e) {
		e = e || window.event;
		var xx = 0;
		var zz = 0;
		var speed = 1;

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
			'id': socketID
		});
		
		obj[sceneObjId].socket.emit('getUserList');				
	};

	obj[sceneObjId].socket.on('deleteGridObj', function(userID) {
		var clientID = userID + "CubeObj";
		obj[sceneObjId].remove(obj[clientID]);
	});

	obj[sceneObjId].socket.on('returnUserList', function(userID, userData) {
		
		var userCube = userData;		
		var uIDCube = userID + "CubeObj";
		var clientCube = obj[uIDCube];
		
		if ((typeof clientCube) != "undefined") {
			
			if (userID != socketID) {
				
				clientCube.position.z = userCube.z;
				clientCube.position.x = userCube.x;
				group.add(clientCube);
				obj[sceneObjId].add(clientCube);
					
			}
			
		} else {
			
			var uIDCube1 = userID + "CubeObj";
			
			var cWidth1 = userData.w;
			var cHeight1 = userData.h;
			var cDepth1 = userData.d;
			var cColor1 = userData.color;
			
			var cubeColorRGB1 = new THREE.Color(cColor1);
			var cubeGeom1 = new THREE.BoxGeometry(cWidth1, cHeight1, cDepth1);
			var cubeColor1 = new THREE.MeshBasicMaterial({ color: cubeColorRGB1, opacity: 0.7, transparent: true });
			obj[uIDCube1] = new THREE.Mesh(cubeGeom1, cubeColor1);
			
			group.add(obj[uIDCube1]);
			obj[uIDCube1].name = userID;
			obj[sceneObjId].add(obj[uIDCube1]);
							
			obj[uIDCube1].position.set(userData.x, 7, userData.z);
		}
		
	});
	
	obj[sceneObjId].socket.on('move', function(data) {
			var newCamZ = data.CamObj.z;
			var newCubeZ = data.CubeObj.z;

			var newCamX = data.CamObj.x;
			var newCubeX = data.CubeObj.x;
					
			obj[cubeObjId].position.set(newCamX, 7, newCubeZ);
			obj[camObjId].position.set(newCamX, 8, newCamZ);
			obj[camObjId].up = new THREE.Vector3(0, 9, newCamZ);
	});
	
});
