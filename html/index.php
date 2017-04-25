<?php
function crc32b($ptf) {
  return hash_file('crc32b', $ptf);
}
?>

<!DOCTYPE html>
<html>

  <head>
	  <meta charset="UTF-8">
	  <title>x³ | xQube</title>
    <link href="./resources/css/xqube.css?v=<?php echo crc32b('./resources/css/xqube.css'); ?>" rel="stylesheet">
    <script src="./resources/js/three.js?v=<?php echo crc32b('./resources/js/three.js'); ?>"></script>
    <script src="./resources/js/main.js?v=<?php echo crc32b('./resources/js/main.js'); ?>"></script>
    <script src="./resources/js/jquery-1.12.4.min.js?v=<?php echo crc32b('./resources/js/jquery-1.12.4.min.js'); ?>"></script>
	</head>

  <body onload="onLoad()">
		<div id="bodyDiv"></div>
	</body>

</html>
