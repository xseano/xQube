const io = require('socket.io').listen(8080);
var obj = this;
const cowsay = require('cowsay');
const colors = require('colors');
global.Logger = require('./modules/Logger');
global.Commands = require('./modules/Commands');
global.readline = require('readline');
global.rl = readline.createInterface(process.stdin, process.stdout);

var playerList = [];

function KekCube() {
    this.commands = new Commands(this).start();
}

KekCube.prototype.start = function() {
    Logger.white(cowsay.say({
        text : "KekCube",
        e : "oO",
        T : "U "
    }));

    Logger.prompt(this.handleCommand.bind(this));
    Logger.info("KekCube server deployed and running!".cyan);
}

KekCube.prototype.handleCommand = function(data) {
	this.commands.parse(data);
	Logger.prompt(this.handleCommand.bind(this));
}

io.sockets.on('connection', function (socket) {
    
    socket.on('loginEv', function(data) {
        var pName = data.name;
        var pClass = data.className;
        
        if ((pName) && (pClass === "Warrior")) {
            obj[pName] = new Player(pName, 100, 100, 500);
            Player.prototype.className = null;
            obj[pName].className = pClass;
        }
        playerList.push(obj[pName]);
        console.log(obj[pName]);
   
    });
    
    
    socket.on('changePos', function (data) {
            var pName = data.name;
            var pClass = data.className;
            
            obj[pName].x = data.x;
            obj[pName].y = data.y;
            
            var displayName = obj[pName].name;
            var displayX = obj[pName].x;
            var displayY = obj[pName].y;
            var displayClass = obj[pName].className;
            var debugMsg = displayName + ":   x: {" + displayX + "} || y: {" + displayY + "}";
            console.log(debugMsg);

      	});
    
    socket.on('fetch.players', function(data) {
            var pName = data.name;
            var pClass = data.className;
            var displayName = obj[pName].name;
            var displayX = obj[pName].x;
            var displayY = obj[pName].y;
            socket.emit('fetch.players', playerList);
            console.log(playerList);
      	});

});


module.exports = KekCube;
