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
    data: {
      x: 'x',
      columns: [
        ['x'],
        ['temperature']
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d\n%H:%M:%S'
        }
      }
    }
  });

  socket.emit('temperature:getAll', function(err, temperatures) {
    chart.flow({
      columns: [
        ['x', ...temperatures.slice(-5).map(t => new Date(t.date))],
        ['temperature', ...temperatures.slice(-5).map(t => t.value)]
      ]
    });
  });

  socket.on('temperature:sensor:new', temperature => {
    chart.flow({
      columns: [
        ['x', new Date(temperature.date)],
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
