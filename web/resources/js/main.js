$.getJSON("../../conf/conf.json", function(conf) {
		window.conf = conf;
		window.isDevEnv = conf.isDevEnv; // Enable this for developer environment
});

function updateColor(picker) {
    document.getElementById('colorInput').value = picker.toHEXString();
}

function startGame() {
  window.game = new Game(conf);
  game.start();
}

function chatMsgSent() {
  game.network.utils.sendChat();
}
