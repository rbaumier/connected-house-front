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

  socket.emit('temperature:getAll', function(err, temperatures) {
    console.log("temperature:", temperatures);
  });

  // socket.emit('temperature:limit:new', 12, (err) => {
  //   if(!err) {
  //     console.log('OK');
  //   }
  // });
});
