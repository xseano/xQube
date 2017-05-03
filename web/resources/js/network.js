class Network {

  constructor(game) {
    this.id = game.id;
    this.game = game;
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.renderer = new THREE.WebGLRenderer();
    this.date = new Date();
    this.conf = game.conf;
    this.isConnected = false;
  }

  onLoad() {

  	$('#mainScreen').fadeOut('fast');

  		$('#connectScreen').fadeIn('fast');

  		if (isDevEnv === true) {
  			var xWebServer = conf.wsServerDev + ':' + conf.wsPortDev;
  			this.socket = new WebSocket(xWebServer);
  		} else if (isDevEnv === false) {
  			var xWebServer = conf.wsServer + ':' + conf.wsPort;
  			this.socket = new WebSocket(xWebServer);
  		}

  		this.socket.binaryType = "arraybuffer";
      this.socket.onclose = this.onError.bind(this);
      this.socket.onerror = this.onError.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
  		this.socket.onopen = this.onOpen.bind(this);
      this.utils = new Utils(this.socket);
  }

  onOpen() {

  	$('#connectScreen').fadeOut('fast');
  	$('#userList').fadeIn('fast');
  	$('#chatList').fadeIn('fast');

  	var keys = {};
    var utl = new Utils(this.socket);
    var pObj = this;

    $(document).keydown(function (e) {
      keys[e.key] = true;
      for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;
        if ($("#chat-text").is(":focus") == false) {
          if (pObj.isConnected == true) {
            var di = pObj.player.id;
            utl.sendPos(i, di);
          }
        }
      }
      utl.getUserList();
    });

    $(document).keyup(function (e) {
      delete keys[e.key];
    });
  }

  onMessage(msg) {
  	var objUArr = new Uint8Array(msg);
  	var objStr = this.utils.ab2str(objUArr);
  	var offset = 3;
  	var buffer = new DataView(msg.data);
  	var newArr = [];

  	for (var i = 0; i < buffer.buffer.byteLength; i++) {
  		newArr.push(buffer.getUint8(i, true));
  	}

  	var newUint8Arr = new Uint8Array(newArr);
  	var hr2Arr = this.utils.ab2str(newUint8Arr);

  	var parsed = JSON.parse(hr2Arr);
  	var mID = parsed.id;

  	if (mID == 'rmClient') {
      this.player.removeClient(parsed);
  	}

  	if (mID == 'chatObject') {
      this.player.handleChat(parsed);
  	}

  	if (mID == 'create') {
      var clientName = document.getElementById('login-name').value;
      var clientColor = document.getElementById('colorInput').value;
      this.player = new Player(parsed.uID.id, clientName, clientColor, this)
      this.player.create(parsed);
      this.isConnected = true;
  	}

  	if (mID == 'move') {
      this.player.move(parsed);
  	}

  	if (mID == 'returnUserList') {
      this.player.returnUserList(parsed);
  }
}

  chatMsg() {
    this.utils.sendChat();
  }

  onConn() {
  	if (this.socket.readyState == 1) {
      this.game.startOpen();
  	} else {
  		this.game.start();
  	}
  }

  onError(e) {
    this.onClose(e, true);
  }

  onClose(e, error) {
  		if (e.code || e.reason) {
  				console.log("Socket Closed! Reason: " + e.code + " " + e.reason);
  				this.onConn();
  		} else {
  				console.log("Socket Error!");
  		}

  		$('#render').fadeOut('fast');
  		$('#userList').fadeOut('fast');
  		$('#chatList').fadeOut('fast');

  }
}
