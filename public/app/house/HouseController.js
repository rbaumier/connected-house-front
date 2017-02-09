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

  var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['temperature']
      ],
      axes: {
        data2: 'y2' // ADD
      }
    },
    axis: {
      y2: {
        show: true // ADD
      },

    }
  });

  socket.emit('temperature:getAll', function(err, temperatures) {
    chart.flow({
      columns: [
        // ['x', ...temperatures.slice(-5).map(t => t.date)],
        ['temperature', ...temperatures.slice(-5).map(t => t.value)]
      ]
    });
  });


  socket.on('temperature:sensor:new', temperature => {
    chart.flow({
      columns: [
        ['temperature', temperature.value]
      ]
    });
  });

  // socket.emit('temperature:limit:new', 12, (err) => {
  //   if(!err) {
  //     console.log('OK');
  //   }
  // });
});
