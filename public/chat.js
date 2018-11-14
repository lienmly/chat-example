$(document).ready(function () {
  // Make connection
  // var socket = io();
  var socket = io.connect('http://localhost:3000');
  var userName = '';
  var submittedData;

  // Emit events
  $('#mform').submit(function(){
    // socket.emit('chat message', $('#m').val());
    submittedData = {
      message: $('#m').val(),
      nickname: userName
    };

    $('#messages').append($('<li>').text(submittedData.nickname + ': ' + submittedData.message));
    socket.emit('chat message', submittedData);
    $('#m').val('');

    return false;
  });

  // Listen for events
  socket.on('chat message', function(data){
    console.log('Client: ' + data.nickname + ': ' + data.message); 
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
