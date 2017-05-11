class Network {

  constructor(game) {
    this.id = game.id;
    this.game = game;
    this.scene = new THREE.Scene();
    this.group = new THREE.Group();
    this.keyboard = new THREEx.KeyboardState();
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

  }

  update() {

    if (this.keyboard.pressed('w') || this.keyboard.pressed('up')) {
        this.utils.sendKey('w');
        this.utils.getUserList();
    }

    if (this.keyboard.pressed('a') || this.keyboard.pressed('left')) {
        this.utils.sendKey('a');
        this.utils.getUserList();
    }

    if (this.keyboard.pressed('s') || this.keyboard.pressed('down')) {
        this.utils.sendKey('s');
        this.utils.getUserList();
    }

    if (this.keyboard.pressed('d') || this.keyboard.pressed('right')) {
        this.utils.sendKey('d');
        this.utils.getUserList();
    }

  }

  onMessage(msg) {

    msg = new DataView(msg.data);

    var offset = 0;
    var id = String.fromCharCode(msg.getUint8(offset++));

    //console.log("Got id: " + id);

    switch (id) {

        case 'c':
          this.createClient(msg, offset);
          break;
        case 'm':
          this.player.move(msg, offset);
          break;
        case 'r':
          //console.log(this.readStringUtf8(msg, offset, msg.buffer.byteLength));
          this.player.removeClient(msg, offset);
          break;
        case 'h':
          this.player.handleChat(msg, offset);
          break;
        case 'u':
          this.player.returnUserList(msg, offset);
          break;
    }
}

  chatMsg() {
    this.utils.sendChat();
  }

  createClient(msg, offset) {

    var id = msg.getUint32(offset, true);
    offset += 4;
    var x = msg.getUint32(offset, true);
    offset += 4;
    var z = msg.getUint32(offset, true);
    offset += 4;
    var w = msg.getUint32(offset, true);
    offset += 4;
    var h = msg.getUint32(offset, true);
    offset += 4;
    var d = msg.getUint32(offset, true);
    offset += 4;
    var cx = msg.getUint32(offset, true);
    offset += 4;
    var cz = msg.getUint32(offset, true);
    offset += 4;

    var clientName = document.getElementById('login-name').value;
    var clientColor = document.getElementById('colorInput').value;

    if (((clientName != undefined) && (clientName != '')) && ((clientColor != undefined) && (clientColor != ''))) {
      var cn = clientName;
      var cc = clientColor;
    } else {
      var cn = 'Player';
      var cc = 'rgb(255, 255, 255)';
    }

    this.player = new Player(id, cn, cc, this);
    this.player.create(x, z, w, h, d, cc, cx, cz);
    this.isConnected = true;
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
