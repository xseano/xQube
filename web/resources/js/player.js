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
    this.network = netObj;

  }

  create(x, z, w, h, d, c, cx, cz) {

    console.log(this.id);

    this.utils.sendName(this.cName);
    this.utils.sendColor(this.cColor);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = "render";
    document.body.appendChild(this.renderer.domElement);

    var scale = conf.scale;
    var sections = conf.selections;
    var baseGrid = new THREE.GridHelper(scale, sections);
    this.scene.add(baseGrid);

    this.camObj = new THREE.PerspectiveCamera(conf.camOption1, window.innerWidth/window.innerHeight, conf.camOption2, conf.camOption3);

    var cWidth = w;
    var cHeight = h;
    var cDepth = d;
    var cColor = c;
    var camZ = cz;

    var cubeColorRGB = new THREE.Color(this.cColor);
    var cubeGeom = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
    var cubeColor = new THREE.MeshBasicMaterial({ color: cubeColorRGB, opacity: conf.opacityVal, transparent: conf.wantTransparent });

    this.scene.add(this.group);
    this.cubeObj = new THREE.Mesh(cubeGeom, cubeColor);
    this.cubeObj.name = this.id;
    this.group.add(this.cubeObj);
    this.scene.add(this.cubeObj);

    this.nameText = this.makeTextSprite(this.cName, {'textColor': this.cColor});
    this.cubeObj.add(this.nameText);
    this.nameText.position.set(3.5, 2.5, 2.5);

    this.cubeObj.position.set(x, conf.cubeY, z);
    this.camObj.position.set(cx, conf.cameraHeight, cz);
    this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);

    var rndr = this.renderer;
    var scn = this.scene;
    var cm = this.camObj;
    var thObj = this;
    var utls = this.utils;

    var render = function() {
      thObj.network.update();
      requestAnimationFrame(render);
      rndr.render(scn, cm);
      thObj.date = new Date();
    };

    render();
    this.utils.getUserList();
  }

  move(msg, offset) {

    var x = msg.getInt32(offset, true);
    offset += 4;
    var z = msg.getInt32(offset, true);
    offset += 4;
    var cx = msg.getInt32(offset, true);
    offset += 4;
    var cz = msg.getInt32(offset, true);
    offset += 4;

    var now = new Date();
    var delta = (Date.now() - this.date) / 120;

    var lX = this.utils.lerp(this.cubeObj.position.x, x, delta);
    var lZ = this.utils.lerp(this.cubeObj.position.z, z, delta);

    var lCx = this.utils.lerp(this.camObj.position.x, cx, delta);
    var lCz = this.utils.lerp(this.camObj.position.z, cz, delta);

    if(conf.wantLerp == true) {
      this.cubeObj.position.set(lX, conf.cubeY, lZ);
      this.camObj.position.y = conf.cameraHeight;
      this.camObj.position.x = lCx;
      this.camObj.position.z = lCz;
      this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);
    } else {
      this.cubeObj.position.set(x, conf.cubeY, z);
      this.camObj.position.y = conf.cameraHeight;
      this.camObj.position.x = cx;
      this.camObj.position.z = cz;
      this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);
    }

  }

  removeClient(msg, offset) {

    var uid = msg.getUint8(offset++);
    offset++;

    var userName = "";

    for (var i = offset; i < msg.byteLength; i++) {
      var letter = String.fromCharCode(msg.getUint8(i));
      userName += letter;
    }

    var result = $.grep(this.scene.children, function(e){ return e.name == uid; });

    if (result.length == 1) {
      $('#' + uid).remove();
      this.scene.remove(result[0]);

      var chatListElement = document.getElementById('cList');
      var listElement = document.createElement("li");
      listElement.className = 'chatInList';
      listElement.innerHTML = "<b>User: " + userName + " has gone offline!</b>";
      listElement.style.color = 'white';
      chatListElement.appendChild(listElement);
      $('#cList').animate({scrollTop: $('#cList').prop("scrollHeight")}, 500);
    }
  }

  returnUserList(msg, offset) {

    var userID = msg.getUint8(offset, true);
    offset++;
    var x = msg.getInt32(offset, true);
    offset += 4;
    var z = msg.getInt32(offset, true);
    offset += 4;
    var w = msg.getUint8(offset, true);
    offset++;
    var h = msg.getUint8(offset, true);
    offset++;
    var d = msg.getUint8(offset, true);
    offset++;
    var r = msg.getUint8(offset, true);
    offset++;
    var g = msg.getUint8(offset, true);
    offset++;
    var b = msg.getUint8(offset, true);
    offset++;

    var userColor = ( 'rgb(' + r + ',' + g + ',' + b + ')' );

    var userListElement = document.getElementById('uList');

    if (document.getElementById(userID) == null) {
      var listElement = document.createElement("li");
      listElement.id = userID;
      listElement.className = 'userInList';
      listElement.innerHTML = userID; // userName
      listElement.style.color = userColor;
      userListElement.appendChild(listElement);
    }

    var result = $.grep(this.scene.children, function(e) { return e.name == userID; });

    if (result.length == 0) {

      var cWidth1 = w;
      var cHeight1 = h;
      var cDepth1 = d;
      var cColor1 = userColor; // userColor

      var cubeColorRGB1 = new THREE.Color(cColor1);
      var cubeGeom1 = new THREE.BoxGeometry(cWidth1, cHeight1, cDepth1);
      var cubeColor1 = new THREE.MeshBasicMaterial({ color: cubeColorRGB1, opacity: conf.opacityVal, transparent: conf.wantTransparent });
      var cube = new THREE.Mesh(cubeGeom1, cubeColor1);

      this.group.add(cube);
      cube.name = userID;
      this.scene.add(cube);

      var nt = this.makeTextSprite(userID/* userName */, {'textColor': cColor1});
      cube.add(nt);
      nt.position.set(3.5, 2.5, 2.5);

      cube.position.set(x, conf.cubeY, z);

    } else if (result.length == 1) {

      if (result[0].name != this.id) {

        //console.log(result[0]);

        var now = new Date();
        var delta = (Date.now() - this.date) / 120;
        //console.log(delta);

        var nx = this.utils.lerp(result[0].position.z, x, delta);
        var nz = this.utils.lerp(result[0].position.z, z, delta);

        result[0].position.z = z;
        result[0].position.x = x;
        result[0].position.y = conf.cubeY;

      }

    } else {
        console.log("Found results: " + result);
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
