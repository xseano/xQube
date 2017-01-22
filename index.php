<?php
function crc_file($filepath)
{
	return hash_file('crc32b', $filepath);
}
?>
<!DOCTYPE html>
		<html>
			<head>
				<meta charset="UTF-8">
				<title>KekCube</title>
				<style>
					body { margin: 0; }
					canvas { width: 100%; height: 100% }
				</style>
			</head>
	<body>
		<script src="js/three.js"></script>
		<script src="./js/main.js?v=<?php echo crc_file('./js/main.js'); ?>"></script>
		<script type="text/javascript" src="./server/node_modules/socket.io-client/dist/socket.io.min.js"></script>
	</body>
</html>