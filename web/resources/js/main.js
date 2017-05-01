$.getJSON("../../conf/conf.json", function(conf) {
		window.conf = conf;
		window.isDevEnv = conf.isDevEnv; // Enable this for developer environment
});

function updateColor(picker) {
    document.getElementById('colorInput').value = picker.toRGBString();
}

var obj = this;
const id = getRandomInt(1, 65355);
var sceneObjId = id + "SceneObj";
obj[sceneObjId] = new SceneObj(id);

function ClientData(id, name, color) {
	this.id = id;
	this.name = name;
	this.color = color;
}

function SceneObj(id) {
		this.id = id;
    this.scene = new THREE.Scene();
		this.group = new THREE.Group();
}

function KeyObj(id, key, uid) {
	this.id = id;
	this.key = key;
	this.uid = uid;
}

function DataObject(id, data) {
	this.id = id;
	this.data = data;
}

function GetUserList(id) {
	this.id = id;
}

function onLoad() {

	$('#mainScreen').fadeOut('fast', function() {

		$('#connectScreen').fadeIn('fast');

		if (isDevEnv === true) {
			var xWebServer = conf.wsServerDev + ':' + conf.wsPortDev;
			obj[sceneObjId].socket = new WebSocket(xWebServer);
		} else if (isDevEnv === false) {
			var xWebServer = conf.wsServer + ':' + conf.wsPort;
			obj[sceneObjId].socket = new WebSocket(xWebServer);
		}

		var ws = obj[sceneObjId].socket;

		ws.binaryType = "arraybuffer";
    ws.onclose = error;
    ws.onerror = error;
    ws.onmessage = message;
		ws.onopen = onOpen;

	});
}

function onConn() {
	if (obj[sceneObjId].socket.readyState == 1) {
		onOpen();
	} else {
		onLoad();
	}
}

function error(e) {
		close(e, true);
}

function close(e, error) {
		if (e.code || e.reason) {
				console.log("Socket Closed! Reason: " + e.code + " " + e.reason);
				onConn();
		} else {
				console.log("Socket Error!");
		}

		$('#render').fadeOut('fast');
		$('#userList').fadeOut('fast');
		$('#chatList').fadeOut('fast');

}

function sendChat() {
	var chatText = document.getElementById('chat-text').value;
	var chatObj = new DataObject('chatMessage', chatText);
	var cO = uintIfy(chatObj);
	obj[sceneObjId].socket.send(cO);
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }

function makeTextSprite(message, parameters) {
		if ( parameters === undefined ) parameters = {};
		var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
		var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 15;
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
		var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:0 };
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:0, g:0, b:0, a:0 };
		var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
		var metrics = context.measureText( message );
		var textWidth = metrics.width;

		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

		context.lineWidth = borderThickness;
		roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

		context.fillStyle = textColor;
		context.fillText( message, borderThickness, fontsize + borderThickness);

		var texture = new THREE.Texture(canvas)
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
		return sprite;
}

function message(msg) {
	var objUArr = new Uint8Array(msg);
	var objStr = ab2str(objUArr);
	var offset = 3;
	var buffer = new DataView(msg.data);
	var newArr = [];

	for (var i = 0; i < buffer.buffer.byteLength; i++) {
		newArr.push(buffer.getUint8(i, true));
	}

	var newUint8Arr = new Uint8Array(newArr);
	var hr2Arr = ab2str(newUint8Arr);

	var parsed = JSON.parse(hr2Arr);
	var mID = parsed.id;

	if (mID == 'rmClient') {
		var clientID = parsed.data.id + "CubeObj";
		$('#'+parsed.data.id).remove();
		obj[sceneObjId].scene.remove(obj[clientID]);

		var chatColor = parsed.color;
		var chatName = parsed.name;

		var chatListElement = document.getElementById('cList');
		var listElement = document.createElement("li");
		listElement.className = 'chatInList';
		listElement.innerHTML = "User: " + chatName + " has gone offline!";
		listElement.style.color = 'white';
		chatListElement.appendChild(listElement);
	}

	if (mID == 'chatObject') {
		var chatColor = parsed.color;
		var chatName = parsed.name;
		var chatMsg = parsed.msg;

		var chatListElement = document.getElementById('cList');
		var listElement = document.createElement("li");
		listElement.className = 'chatInList';
		listElement.innerHTML = chatName + ": " + chatMsg;
		listElement.style.color = chatColor;
		chatListElement.appendChild(listElement);
	}

	if (mID == 'create') {
		var clientName = document.getElementById('login-name').value;
		var clientColor = document.getElementById('colorInput').value;
		this.cName = clientName;
		this.cColor = clientColor;
		sendClientData(this.cName, this.cColor);
		console.log('Client ID: ' + parsed.uID.id);
		this.quid = parsed.uID.id;

		var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.id = "render";
		document.body.appendChild(renderer.domElement);

		var scale = conf.scale;
		var sections = conf.selections;
		var baseGrid = new THREE.GridHelper(scale, sections);
		obj[sceneObjId].scene.add(baseGrid);

		var camObjId = this.quid + "CamObj";
		var textObjId = this.quid + "TextObj";
		var cubeObjId = this.quid + "CubeObj";
		obj[camObjId] = new THREE.PerspectiveCamera(conf.camOption1, window.innerWidth/window.innerHeight, conf.camOption2, conf.camOption3);

		var cWidth = parsed.cubeID.w;
		var cHeight = parsed.cubeID.h;
		var cDepth = parsed.cubeID.d;
		var cColor = parsed.cubeID.color;
		var camZ = parsed.camID.z;

		var cubeColorRGB = new THREE.Color(this.cColor);
		var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
		var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: conf.opacityVal, transparent: conf.wantTransparent });

		var group = obj[sceneObjId].group;
		obj[sceneObjId].scene.add(group);
		obj[cubeObjId] = new THREE.Mesh(cubeGeom, cubeColor);
		obj[cubeObjId].name = socketID;
		group.add(obj[cubeObjId]);
		obj[sceneObjId].scene.add(obj[cubeObjId]);

		obj[textObjId] = makeTextSprite(this.cName, {'textColor': this.cColor});
		obj[cubeObjId].add(obj[textObjId]);
		obj[textObjId].position.set(3.5, 2.5, 2.5);

		obj[cubeObjId].position.set(parsed.cubeID.x, conf.cubeY, parsed.cubeID.z);
		obj[camObjId].position.set(parsed.camID.x, conf.cameraHeight, parsed.camID.z);
		obj[camObjId].rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);

		var render = function() {
			requestAnimationFrame(render);
			renderer.render(obj[sceneObjId].scene, obj[camObjId]);
		};

		render();
		getUserList();
	}

	if (mID == 'move') {
		var jsonObj = parsed.data;

		var newCamZ = jsonObj.CamObj.z;
		var newCubeZ = jsonObj.CubeObj.z;

		var newCamX = jsonObj.CamObj.x;
		var newCubeX = jsonObj.CubeObj.x;

		var socketID = this.quid;
		var camObjId = socketID + "CamObj";
		var cubeObjId = socketID + "CubeObj";

		obj[cubeObjId].position.set(newCamX, conf.cubeY, newCubeZ);
		obj[camObjId].position.y = conf.cameraHeight;
		obj[camObjId].rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);
		obj[camObjId].position.x = newCubeX;
		obj[camObjId].position.z = newCamZ;
	}

	if (mID == 'returnUserList') {

		var userData = parsed.CubeObj;
		var userCube = userData;
		var userID = parsed.uid;
		var uIDCube = userID + "CubeObj";
		var clientCube = obj[uIDCube];
		var userColor = parsed.color;
		var userName = parsed.name;

		var userListElement = document.getElementById('uList');

		if (document.getElementById(userID) == null) {
			var listElement = document.createElement("li");
			listElement.id = userID;
			listElement.className = 'userInList';
			listElement.innerHTML = userName;
			listElement.style.color = userColor;
			userListElement.appendChild(listElement);
		}

		if ((typeof clientCube) != "undefined") {

			if (userID != this.quid) {

				clientCube.position.z = userCube.z;
				clientCube.position.x = userCube.x;
				clientCube.position.y = conf.cubeY;
			}

		} else {

			var uIDCube1 = userID + "CubeObj";
			var textObjId1 = userID + "TextObj";
			var cWidth1 = userData.w;
			var cHeight1 = userData.h;
			var cDepth1 = userData.d;
			var cColor1 = userData.color;

			var cubeColorRGB1 = new THREE.Color(cColor1);
			var cubeGeom1 = new THREE.BoxGeometry(cWidth1, cHeight1, cDepth1);
			var cubeColor1 = new THREE.MeshBasicMaterial({ color: cubeColorRGB1, opacity: conf.opacityVal, transparent: conf.wantTransparent });
			obj[uIDCube1] = new THREE.Mesh(cubeGeom1, cubeColor1);

			obj[sceneObjId].group.add(obj[uIDCube1]);
			obj[uIDCube1].name = userID;
			obj[sceneObjId].scene.add(obj[uIDCube1]);

			obj[textObjId1] = makeTextSprite(userName, {'textColor': cColor1});
			obj[uIDCube1].add(obj[textObjId1]);
			obj[textObjId1].position.set(3.5, 2.5, 2.5);

			obj[uIDCube1].position.set(userData.x, conf.cubeY, userData.z);
		}
	}
}

function str2ab(str) {
    var escstr = encodeURIComponent(str);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(conf.charCode + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}

function ab2str(ab) {
    var binstr = Array.prototype.map.call(ab, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(conf.dataLength).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });
    return decodeURIComponent(escstr);
}

function uintIfy(obj) {
	var stringifiedObj = JSON.stringify(obj); // "{'x': '1'}"
	var abObj = str2ab(stringifiedObj); // Uint8Array[xyx, yzx, yxz, zyx]
	return abObj;
}

function sendPos(key, uid) {
	var keyObj = new KeyObj('updatePos', key, uid);
	var arr = uintIfy(keyObj);
	obj[sceneObjId].socket.send(arr);

}

function sendClientData(name, color) {
	var cData = new ClientData('sendClientData', name, color);
	var c = uintIfy(cData);
	obj[sceneObjId].socket.send(c);

}

function getUserList() {
	var ulObj = new GetUserList('getUserList');
	var ulObjArr = uintIfy(ulObj);
	obj[sceneObjId].socket.send(ulObjArr);
}

function onOpen() {

	$('#connectScreen').fadeOut('fast');
	$('#userList').fadeIn('fast');
	$('#chatList').fadeIn('fast');

	var socketID = this.quid;
	var keys = {};

	$(document).keydown(function (e) {
		keys[e.key] = true;
		for (var i in keys) {
			if (!keys.hasOwnProperty(i)) continue;
			console.log($("#chat-text").is(":focus"));
			if ($("#chat-text").is(":focus") == false) {
				sendPos(i, socketID);
			}
		}
		getUserList();
	});

	$(document).keyup(function (e) {
		delete keys[e.key];
	});
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
