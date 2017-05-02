class Player {

  constructor(id, name, color, netObj) {
    this.id = id;
    this.cName = name;
    this.cColor = color;
    this.scene = netObj.scene;
    this.date = netObj.date;
    this.group = netObj.group;
    this.utils = netObj.utils;
    this.conf = netObj.conf;
    this.renderer = netObj.renderer;

  }

  create(parsed) {
    this.utils.sendClientData(this.cName, this.cColor);;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = "render";
    document.body.appendChild(this.renderer.domElement);

    var scale = conf.scale;
    var sections = conf.selections;
    var baseGrid = new THREE.GridHelper(scale, sections);
    this.scene.add(baseGrid);

    this.camObj = new THREE.PerspectiveCamera(conf.camOption1, window.innerWidth/window.innerHeight, conf.camOption2, conf.camOption3);

    var cWidth = parsed.cubeID.w;
    var cHeight = parsed.cubeID.h;
    var cDepth = parsed.cubeID.d;
    var cColor = parsed.cubeID.color;
    var camZ = parsed.camID.z;

    var cubeColorRGB = new THREE.Color(this.cColor);
    var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
    var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: conf.opacityVal, transparent: conf.wantTransparent });

    this.scene.add(this.group);
    this.cubeObj = new THREE.Mesh(cubeGeom, cubeColor);
    this.cubeObj.name = this.id;
    this.group.add(this.cubeObj);
    this.scene.add(this.cubeObj);

    //this.nameText = this.makeTextSprite(this.cName, {'textColor': this.cColor});
    //this.cubeObj.add(this.nameText);
    //this.nameText.position.set(3.5, 2.5, 2.5);

    this.cubeObj.position.set(parsed.cubeID.x, conf.cubeY, parsed.cubeID.z);
    this.camObj.position.set(parsed.camID.x, conf.cameraHeight, parsed.camID.z);
    this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);

    var rndr = this.renderer;
    var scn = this.scene;
    var cm = this.camObj;
    var dt = this.date;


    var render = function() {
      requestAnimationFrame(render);
      rndr.render(scn, cm);
      dt = new Date();
    };

    render();
    this.utils.getUserList();
  }

  move(parsed) {
    var jsonObj = parsed.data;

    var newCamZ = jsonObj.CamObj.z;
    var newCubeZ = jsonObj.CubeObj.z;

    var newCamX = jsonObj.CamObj.x;
    var newCubeX = jsonObj.CubeObj.x;

    var now = new Date();
    var delta = (Date.now() - this.scene.date) / 120;

    var x = this.utils.lerp(this.cubeObj.position.x, newCubeX, delta);
    var z = this.utils.lerp(this.cubeObj.position.z, newCubeZ, delta);

    var cx = this.utils.lerp(this.camObj.position.x, newCamX, delta);
    var cz = this.utils.lerp(this.camObj.position.z, newCamZ, delta);

    this.cubeObj.position.set(x, conf.cubeY, z);
    this.camObj.position.y = conf.cameraHeight;
    this.camObj.position.x = cx;
    this.camObj.position.z = cz;
    this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);
  }

  removeClient(parsed) {
    var clientID = parsed.data.id + "CubeObj";
		$('#'+parsed.data.id).remove();
		this.scene.remove(this.cubeObj);

		var chatColor = parsed.color;
		var chatName = parsed.name;

		var chatListElement = document.getElementById('cList');
		var listElement = document.createElement("li");
		listElement.className = 'chatInList';
		listElement.innerHTML = "User: " + chatName + " has gone offline!";
		listElement.style.color = 'white';
		chatListElement.appendChild(listElement);
		$('#cList').animate({scrollTop: $('#cList').prop("scrollHeight")}, 500);

  }

  returnUserList(parsed) {
    var userData = parsed.CubeObj;
    var userID = parsed.uid;
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

      if (parsed.uid != this.id) {

        this.cubeObj.position.z = parsed.CubeObj.z;
        this.cubeObj.position.x = parsed.CubeObj.x;
        this.cubeObj.position.y = conf.cubeY;
      }

    } else {

      var cWidth1 = userData.w;
      var cHeight1 = userData.h;
      var cDepth1 = userData.d;
      var cColor1 = userData.color;

      var cubeColorRGB1 = new THREE.Color(cColor1);
      var cubeGeom1 = new THREE.BoxGeometry(cWidth1, cHeight1, cDepth1);
      var cubeColor1 = new THREE.MeshBasicMaterial({ color: cubeColorRGB1, opacity: conf.opacityVal, transparent: conf.wantTransparent });
      this.camObj1 = new THREE.Mesh(cubeGeom1, cubeColor1);

      this.group.add(this.camObj1);
      this.camObj1.name = userID;
      this.scene.add(this.camObj1);

      //this.nameText1 = this.makeTextSprite(userName, {'textColor': cColor1});
      //this.camObj1.add(this.nameText1);
      //this.nameText1.position.set(3.5, 2.5, 2.5);

      this.camObj1.position.set(userData.x, conf.cubeY, userData.z);
    }
  }


  handleChat(parsed) {
    var chatColor = parsed.color;
    var chatName = parsed.name;
    var chatMsg = parsed.msg;

    var chatListElement = document.getElementById('cList');
    var listElement = document.createElement("li");
    listElement.className = 'chatInList';
    listElement.innerHTML = chatName + ": " + chatMsg;
    listElement.style.color = chatColor;
    chatListElement.appendChild(listElement);

    $('#cList').animate({scrollTop: $('#cList').prop("scrollHeight")}, 500);
  }


  roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill(); ctx.stroke(); }

  makeTextSprite(message, parameters) {
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
  		this.roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

  		context.fillStyle = textColor;
  		context.fillText( message, borderThickness, fontsize + borderThickness);

  		var texture = new THREE.Texture(canvas)
  		texture.needsUpdate = true;

  		var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
  		var sprite = new THREE.Sprite( spriteMaterial );
  		sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
  		return sprite;
  }
}
