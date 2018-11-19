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
      nickname: userName,
      private: false,
      toUser: null
    };

    if (submittedData.message.toLowerCase().indexOf("pm/") == 0) {
      submittedData.private = true;
      submittedData.toUser = submittedData.message.split("/")[1];
      submittedData.message = submittedData.message.split("/")[2];
    }

    // Send message to sender directly, without through server
    $('#messages').append($('<li>').text(submittedData.nickname + ': ' + submittedData.message));

    socket.emit('chat message', submittedData);
    $('#m').val('');

    return false;
  });

  $('#m').focus(function(){
    socket.emit('text change', userName);
  });
  $('#m').focusout(function(){
    socket.emit('text unfocus', userName);
  });

  // Listen for events
  socket.on('chat message', function(data){
    console.log('Client: ' + data.nickname + ': ' + data.message);
    $('#messages').append($('<li>').text(data.nickname + ': ' + data.message));
    // $('div#whotyping').html('');
  });
  socket.on('user connected', function(data){ // Data = socket.id
    $('#messages').append($('<li>').text('A user just joined.'));
  });
  socket.on('text change', function(userName){
    $('div#whotyping').html(userName + ' is typing');
  });
  socket.on('text unfocus', function(userName){
    $('div#whotyping').html('');
  });
  socket.on('client online', function(userName){
    $('#whoonline').append($('<li>').text(userName + ' is online.').attr('id',userName + 'isonline'));
  });
  socket.on('user disconnect', function(data){
    // alert(data + ' just disconnected.');
    let listid = '#' + data + 'isonline';
    $(listid).remove();
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

    // Fire an event to let everyone know this client is online
    socket.emit('client online', userName);
  });
});
