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
    <script src="./resources/js/three.js?v=<?php echo crc32b('./resources/js/three.js'); ?>"></script>
    <script src="./resources/js/jquery-1.12.4.min.js?v=<?php echo crc32b('./resources/js/jquery-1.12.4.min.js'); ?>"></script>
    <script src="./resources/js/main.js?v=<?php echo crc32b('./resources/js/main.js'); ?>"></script>
    <link href="./resources/css/vendor/bootstrap/css/bootstrap.min.css?v=<?php echo crc32b('./resources/css/vendor/bootstrap/css/bootstrap.min.css'); ?>" rel="stylesheet">
    <link href="./resources/css/flat-ui.css?v=<?php echo crc32b('./resources/css/flat-ui.css'); ?>" rel="stylesheet">
    <link href="./resources/css/demo.css?v=<?php echo crc32b('./resources/css/demo.css'); ?>" rel="stylesheet">
  </head>

  <body>
		<div id="mainScreen">
      <center>
        <span class="textMsg">x³ ~ xQube</span>
        <br>
        <div style="margin-top: 100px; width: 80%;" class="login-form">
            <div class="form-group">
              <input type="text" class="form-control login-field" value="" placeholder="Enter your name" id="login-name">
              <label class="login-field-icon fui-user" for="login-name"></label>
            </div>
            <button style="margin-top: 50px;" class="btn btn-primary btn-lg btn-block" onClick="onLoad()">Play</button>
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

<?php include 'sections/footer.php'; ?>


</html>
