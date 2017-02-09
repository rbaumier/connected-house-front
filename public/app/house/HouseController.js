'use strict';

app.controller('HouseController', function($scope) {
  var socket = {};
  socket = io('http://localhost:3003');

  // log socket.io events
  ['error', 'connect_failed', 'reconnect_failed', 'connect', 'connect', 'reconnecting', 'reconnected'].forEach(function(socketIOEvent) {
    socket.on(socketIOEvent, function(message) {
      console.log('SOCKETIO (' + socketIOEvent + ')', message ||  '');
    });
  });

  socket.emit('temperature:get', function(data) {
    console.log("data:", data);
  });
});
