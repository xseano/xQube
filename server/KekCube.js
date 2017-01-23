const io = require('socket.io').listen(8080);
var obj = this;
const cowsay = require('cowsay');
const colors = require('colors');
global.Logger = require('./modules/Logger');
global.Commands = require('./modules/Commands');
global.readline = require('readline');
global.rl = readline.createInterface(process.stdin, process.stdout);

var cObjs = [];

function CubeObject(x, y, z, w, h, d, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
    this.color = color;
}

function CameraObject(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

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
    
    socket.on('newObj', function(data) {
        var id = data.id;
        var camId = id + "Cam";
        var cubeId = id + "Cube";
               
   
        obj[camId] = new CameraObject(0, 0, 4);
        obj[cubeId] = new CubeObject(0, 0, 0, 1, 1, 1, "rgb(174, 129, 255)");
        
        cObjs.push(obj[camId]);
        cObjs.push(obj[cubeId]);
        
        console.log(cObjs);
        socket.emit('buildObjs', cObjs);
    });
    
    socket.on('updatePos', function(data) {
        var xx = data.x;
        var zz = data.z;
        var id = data.id;
        var camId = id + "Cam";
        var cubeId = id + "Cube";
        
        obj[camId].x = obj[camId].x + xx;
        obj[camId].z = obj[camId].z + zz;
        
        obj[cubeId].x = obj[cubeId].x + xx;
        obj[cubeId].z = obj[cubeId].z + zz;
        
        console.log("New Cam: " + obj[camId]);
        console.log("New Cube: " + obj[cubeId]);
        
        socket.emit('move', cObjs);
    });
        

});


module.exports = KekCube;
