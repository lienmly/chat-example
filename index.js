var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketmap = new Object();

// Static files
app.use(express.static('public'));

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
  var USER_NAME = '';
  console.log('a user connected ' + socket.id);

  // Broadcast a message to connected users when someone connects or disconnects.
  socket.broadcast.emit('user connected', socket.id)

  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.broadcast.emit('user disconnect', USER_NAME);
    delete socketmap[USER_NAME];
  });

  socket.on('chat message', function(data){
    // io.emit('chat message', data);
    // data.nickname = USER_NAME;
    if (data.private == false) {
      console.log('====PUBLIC MESSAGE MODE===='); 
      socket.broadcast.emit('chat message', data);
    }
    else {
      // TODO: Broadcast only to the private user, given their username
      // => Loop through map, find <username> key, find corresponding socket to emit it to
      console.log('====PRIVATE MESSAGING MODE====');
      // let toSocket;
      for (var key in socketmap) {
        console.log('connected: ' + key + ' -- ' + socketmap[key]);
        console.log('private to user: ' + data.toUser);
        if (key.toLowerCase() == data.toUser.toLowerCase()) {
          // toSocket = socketmap[key];
          console.log('pm to: ' + key);
          io.to(socketmap[key].id).emit('chat message', data);
        }
      }

      // TODO: Insert <username, socket> into a map when event "connection" is fired
      // TODO: Remove <username, socket> from map when event "disconnect" is fired
    }

    console.log('message: ' + data.message);
  });

  socket.on('text change', function(userName){
    socket.broadcast.emit('text change', userName);
  });
  socket.on('text unfocus', function(userName){
    socket.broadcast.emit('text unfocus', userName);
  });
  socket.on('client online', function(userName){
    socket.broadcast.emit('client online', userName);
    USER_NAME = userName;

    // Add <username-socket> to map, once <username> is defined
    socketmap[USER_NAME] = socket;
  })
});

// App setup
http.listen(3000, function(){
  console.log('listening on *:3000');
});
