class Utils {

  constructor(socket) {
    this.socket = socket;
  }

  sendPacket(data) {
    this.socket.send(data.buffer);
  }

  preparePacket(length) {
    return new DataView(new ArrayBuffer(length));
  }

  sendChat() {
  	var chatText = document.getElementById('chat-text').value;
  	var chatObj = {'id': 'chatMessage', 'data': chatText};
  	var cO = this.uintIfy(chatObj);
  	this.socket.send(cO);
  }

  lerp(a, b, f) {
      return a + f * (b - a);
  }

  hashCode(str) {
  	var hash = 0;
  	if (str.length == 0) return hash;
  	for (var i = 0; i < str.length; i++) {
  		var char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash;
  	}
  	return hash;
  }

  uintIfy(str) {
  	var abObj = this.str2ab(str);
  	return abObj;
  }

  sendDate(uid, date) {
    var dateObj = {'id': 'updateDate', 'uid': uid}
    var arr = this.uintIfy(dateObj);
  	this.socket.send(arr);
  }

  sendKey(key) {
    var msg = this.preparePacket(1);
    msg.setUint8(0, key.charCodeAt(0));
    this.sendPacket(msg);
  }

  sendName(name) {
      var msg = this.preparePacket(2 + 2 * name.length + 2);
      msg.setUint8(0, 'n'.charCodeAt(0));

      var offset = 1;

      for (var i = 0; i < name.length; i++) {
          msg.setUint16(offset, name.charCodeAt(i), true);
          offset += 2;
      }

      this.sendPacket(msg);
  }

  sendColor(color) {
      var msg = this.preparePacket(2 + 2 * color.length + 2);
      msg.setUint8(0, 'c'.charCodeAt(0));

      var offset = 1;

      for (var i = 0; i < color.length; i++) {
          msg.setUint16(offset, color.charCodeAt(i), true);
          offset += 2;
      }

      this.sendPacket(msg);
  }


  getUserList() {
  	var ulObj = {'id': 'getUserList'};
  	var ulObjArr = this.uintIfy(ulObj);
  	this.socket.send(ulObjArr);
  }

}
