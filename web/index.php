<?php
function crc32b($ptf) {
  return hash_file('crc32b', $ptf);
}
?>

<!DOCTYPE html>
<html>

  <head>
	  <meta charset="UTF-8">
	  <title>x³</title>
    <link href="./resources/css/xqube.css?v=<?php echo crc32b('./resources/css/xqube.css'); ?>" rel="stylesheet">
    <script src='./resources/js/threex.keyboardstate.js?v=<?php echo crc32b('./resources/js/threex.keyboardstate.js'); ?>'></script>
    <script src="./resources/js/three.min.js?v=<?php echo crc32b('./resources/js/three.min.js'); ?>"></script>
    <script src="./resources/js/jquery-1.12.4.min.js?v=<?php echo crc32b('./resources/js/jquery-1.12.4.min.js'); ?>"></script>
    <script src="./resources/js/cjson.js?v=<?php echo crc32b('./resources/js/cjson.js'); ?>"></script>
    <script src="./resources/js/game.js?v=<?php echo crc32b('./resources/js/game.js'); ?>"></script>
    <script src="./resources/js/network.js?v=<?php echo crc32b('./resources/js/network.js'); ?>"></script>
    <script src="./resources/js/utils.js?v=<?php echo crc32b('./resources/js/utils.js'); ?>"></script>
    <script src="./resources/js/player.js?v=<?php echo crc32b('./resources/js/player.js'); ?>"></script>
    <script src="./resources/js/main.js?v=<?php echo crc32b('./resources/js/main.js'); ?>"></script>
    <link href="./resources/css/vendor/bootstrap/css/bootstrap.min.css?v=<?php echo crc32b('./resources/css/vendor/bootstrap/css/bootstrap.min.css'); ?>" rel="stylesheet">
    <link href="./resources/css/flat-ui.css?v=<?php echo crc32b('./resources/css/flat-ui.css'); ?>" rel="stylesheet">
    <link href="./resources/css/demo.css?v=<?php echo crc32b('./resources/css/demo.css'); ?>" rel="stylesheet">
    <script src="./resources/js/jscolor.js?v=<?php echo crc32b('./resources/js/jscolor.js'); ?>"></script>
  </head>

  <body>
		<div id="mainScreen">
      <center>
        <span class="textMsg">x³ ~ xQube</span>
        <br>
        <div style="margin-top: 100px; width: 80%;" class="login-form">
            <div class="form-group">
              <input type="text" class="form-control login-field" value="" placeholder="Enter your name" id="login-name">
              <br>
              Choose Cube Color: <input class="jscolor {onFineChange:'updateColor(this)'}" value="FFFFFF">
              <input id="colorInput" type="hidden" name="colorInput" value="#FFFFFF">
              <label class="login-field-icon fui-user" for="login-name"></label>
            </div>
            <button style="margin-top: 50px;" class="btn btn-primary btn-lg btn-block" onClick="startGame()">Play</button>
          </div>
      </center>
    </div>

    <div style="display: none" id="connectScreen">
      <center>
        <span class="textMsg"> ~ x³ ~ </span>
        <br><br><br>
        <span class="textMsg">Connecting to server...</span>
        <br>
      </center>
    </div>
	</body>

  <div style="display: none" id="userList" class="userList">
    <center>
      <span class="headerText">USER LIST</span>
      <ul id="uList" class="uList"></ul>
    </center>
  </div>

  <div style="display: none" id="chatList" class="chatList">
    <center>
      <span class="headerText">CHAT</span>
      <ul id="cList" class="cList"></ul>
      <div id="enterChat">
        <input type="text" class="form-control login-field" value="" placeholder="Type something!" id="chat-text">
        <button style="margin-top: 10px;" class="btn btn-primary btn-lg btn-block" onClick="chatMsgSent()">Send</button>
      </div>
  </div>
    </center>
  </div>

<?php include 'sections/footer.php'; ?>


</html>
