var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Static files
app.use(express.static('public'));

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  console.log('a user connected ' + socket.id);

  // Broadcast a message to connected users when someone connects or disconnects.
  socket.broadcast.emit('user connected', 'A user just joined.')

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(data){
    // io.emit('chat message', data);
    socket.broadcast.emit('chat message', data);
    console.log('message: ' + data.message);
  });

  socket.on('text change', function(userName){
    socket.broadcast.emit('text change', userName);
  });
  socket.on('text unfocus', function(userName){
    socket.broadcast.emit('text unfocus', userName); 
  });
});

// App setup
http.listen(3000, function(){
  console.log('listening on *:3000');
});
