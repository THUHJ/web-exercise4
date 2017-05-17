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
var remoteid=0;

io.on('connection', function(socket){

  //screen login and update namelist. Then update remote by the namelist
  socket.on('login', function(msg){
    console.log(msg+" login")
  	socket.username = msg;

     var index = namelist.indexOf(msg);
     console.log('index:'+index);
     if (index==-1)
  	   namelist.push(msg);

    io.emit('update', namelist);
    
    for (remoteidi in myMap)
    {
      console.log('remoteid:'+remoteidi);
      for (j in myMap[remoteidi])
      {
        console.log(myMap[remoteidi][j]);
      }
    }
  });

  //remote login. Then update remote namelist.
  socket.on('remote', function(msg){
    socket.remoteid = remoteid;
    remoteid+=1;
    myMap[socket.remoteid] = [];
    console.log("remote "+socket.remoteid+" log in");
    console.log("namelist:["+namelist+"]");
    io.emit('update', namelist);
  });

  //change screen img, imgid=-1 means clear img
  socket.on("change img", function(msg){
    io.emit(msg[0], ['img',msg[1]]);
    console.log("remote"+socket.remoteid+" change " +msg);

    if (msg[1]==-1)//remote disconnect some screen
    {
      var index = myMap[socket.remoteid].indexOf(msg[0]);
      myMap[socket.remoteid].splice(index, 1);
    }
    else //remote connect some screen
    {
      
      var index = myMap[socket.remoteid].indexOf(msg[0]);
      if (index==-1)
      {
        console.log("add "+msg[0]+" into "+" remote "+socket.remoteid);
        myMap[socket.remoteid].push(msg[0]);
      }

    }

  });
  socket.on("change size", function(msg){
    io.emit(msg[0], ['size',msg[1]]);
  });

  socket.on('next prev image', function(msg){
    io.emit('next prev image', msg);
  });

  socket.on('disconnect', function(){

  	if (socket.remoteid!=undefined)
    {
      console.log("=====");
      for (i in myMap[socket.remoteid])
      {
        var name = myMap[socket.remoteid][i];
        io.emit(name, ['img',-1]);
        console.log(name);
      }
      console.log(socket.remoteid+' disconnected');
      return;
    }
    if (socket.username!=undefined)
    {
      console.log('before namelist:'+namelist);
    	var index = namelist.indexOf(socket.username);
      if (index!=-1)
  	     namelist.splice(index, 1);
  	  io.emit('update', namelist);
      console.log(socket.username+' user disconnected');
      console.log('after namelist:'+namelist);
    }
  });


});

http.listen(8080, function(){
    console.log('listening on *:8080');
});