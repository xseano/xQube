class Utils {

  constructor(socket) {
    this.socket = socket;
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

  str2ab(str) {
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

  ab2str(ab) {
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

  uintIfy(obj) {
  	var stringifiedObj = JSON.stringify(obj); // "{'x': '1'}"
  	var abObj = this.str2ab(stringifiedObj); // Uint8Array[xyx, yzx, yxz, zyx]
  	return abObj;
  }

  sendPos(key, uid) {
  	var keyObj = {'id': 'updatePos', 'key': key, 'uid': uid};
  	var arr = this.uintIfy(keyObj);
  	this.socket.send(arr);

  }

  sendDate(uid, date) {
    var dateObj = {'id': 'updateDate', 'uid': uid}
    var arr = this.uintIfy(dateObj);
  	this.socket.send(arr);
  }

  sendClientData(name, color) {
  	var cData = {'id': 'sendClientData', 'name': name, 'color': color};
  	var c = this.uintIfy(cData);
  	this.socket.send(c);

  }

  getUserList() {
  	var ulObj = {'id': 'getUserList'};
  	var ulObjArr = this.uintIfy(ulObj);
  	this.socket.send(ulObjArr);
  }

}
