$(document).ready(function () {
  // Make connection
  // var socket = io();
  var socket = io.connect('http://localhost:3000');
  var userName = '';

  // Emit events
  $('#mform').submit(function(){
    // socket.emit('chat message', $('#m').val());
    socket.emit('chat message', {
      message: $('#m').val(),
      nickname: userName
    })
    $('#m').val('');
    return false;
  });

  // Listen for events
  socket.on('chat message', function(data){
    $('#messages').append($('<li>').text(data.nickname + ': ' + data.message));
  });
  socket.on('user connected', function(connectedMsg){
    $('#messages').append($('<li>').text(connectedMsg));
  });

  // Nickname input function
  $('#nicknameform').submit(function(){
    event.preventDefault();
    // Get the name from the form & include it in the message
    if ($('#nickname').val()) {
      // Hide the nickname form
      $('#nicknameform').hide();
      $('.mainPage').show();
      userName = $('#nickname').val();
    }
    else {
      alert('Enter your name!');
    }
  });
});
