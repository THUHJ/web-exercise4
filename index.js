var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});





var myMap = new Map();
var namelist = [];

io.on('connection', function(socket){

  socket.on('login', function(msg){
  	socket.username = msg;
  	namelist.push(msg);
  	myMap[msg] = socket;
    io.emit('update', namelist);
    
  });

  socket.on("change img", function(msg){
  	//console.log("kk"+msg);
    io.emit(msg[0], msg[1]);
    
  });

  socket.on('remote', function(msg){
    io.emit('update', namelist);
    
  });
 

  socket.on('disconnect', function(){
  	//myMap[msg] = null;
  	if (socket.username==null) return;
  	var index = namelist.indexOf(socket.username);
	namelist.splice(index, 1);
	io.emit('update', namelist);
    console.log(socket.username+' user disconnected');
  });


});

http.listen(8080, function(){
    console.log('listening on *:8080');
});