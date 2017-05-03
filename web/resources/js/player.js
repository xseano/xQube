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

    this.nameText = this.makeTextSprite(this.cName, {'textColor': this.cColor});
    this.cubeObj.add(this.nameText);
    this.nameText.position.set(3.5, 2.5, 2.5);

    this.cubeObj.position.set(parsed.cubeID.x, conf.cubeY, parsed.cubeID.z);
    this.camObj.position.set(parsed.camID.x, conf.cameraHeight, parsed.camID.z);
    this.camObj.rotation.x = -(conf.cameraAngle * Math.PI / conf.camAngleFactor);

    var rndr = this.renderer;
    var scn = this.scene;
    var cm = this.camObj;
    var dtObj = this;
    var utls = this.utils;


    var render = function() {
      requestAnimationFrame(render);
      rndr.render(scn, cm);
      dtObj.date = new Date();
      dtObj.utils.sendDate(dtObj.id);
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
    var delta = (Date.now() - this.date) / 120;

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
    var result = $.grep(this.scene.children, function(e){ return e.name == parsed.data.id; });

    if (result.length == 1) {
      $('#' + parsed.data.id).remove();
      this.scene.remove(result[0]);

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
  }

  returnUserList(parsed) {

    var CircularJSON = window.CircularJSON;
    var ulist = CircularJSON.parse(parsed.userList);

    for (var t = 0; t < ulist.length; t++) {

      var userID = ulist[t].id;
      var userName = ulist[t].name;
      var userColor = ulist[t].cubeID.color;
      var userListElement = document.getElementById('uList');

      if (document.getElementById(userID) == null) {
        var listElement = document.createElement("li");
        listElement.id = userID;
        listElement.className = 'userInList';
        listElement.innerHTML = userName;
        listElement.style.color = userColor;
        userListElement.appendChild(listElement);
      }

      var result = $.grep(this.scene.children, function(e) { return e.name == userID; });

      if (result.length == 0) {

        var cWidth1 = ulist[t].cubeID.w;
        var cHeight1 = ulist[t].cubeID.h;
        var cDepth1 = ulist[t].cubeID.d;
        var cColor1 = ulist[t].cubeID.color;

        var cubeColorRGB1 = new THREE.Color(cColor1);
        var cubeGeom1 = new THREE.BoxGeometry(cWidth1, cHeight1, cDepth1);
        var cubeColor1 = new THREE.MeshBasicMaterial({ color: cubeColorRGB1, opacity: conf.opacityVal, transparent: conf.wantTransparent });
        var cube = new THREE.Mesh(cubeGeom1, cubeColor1);

        this.group.add(cube);
        cube.name = ulist[t].id;
        this.scene.add(cube);

        var nt = this.makeTextSprite(userName, {'textColor': cColor1});
        cube.add(nt);
        nt.position.set(3.5, 2.5, 2.5);

        cube.position.set(ulist[t].cubeID.x, conf.cubeY, ulist[t].cubeID.z);

      } else if (result.length == 1) {

        if (result[0].name != this.id) {

          console.log(ulist[t]);

          var now = new Date();
          var delta = (Date.now() - this.date) / 120;
          console.log(delta);

          var x = this.utils.lerp(result[0].position.z, ulist[t].cubeID.x, delta);
          var z = this.utils.lerp(result[0].position.z, ulist[t].cubeID.z, delta);

          result[0].position.z = ulist[t].cubeID.z;
          result[0].position.x = ulist[t].cubeID.x;
          result[0].position.y = conf.cubeY;

        }

    } else {
        console.log("Found results: " + result);
    }
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
