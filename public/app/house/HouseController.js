'use strict';

app.controller('HouseController', function($scope) {
  var socket = {};
  socket = io('http://localhost:3003');
  $scope.TemperatureWanted = 18;

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

  socket.emit('temperature:getAll', (err, temperatures) => {
    $scope.actualTemperature = _.last(temperatures).value;
    $scope.update();
    chart.flow({
      columns: [
        ['x', ...temperatures.slice(-20).map(t => new Date(t.date))],
        ['temperature', ...temperatures.slice(-20).map(t => t.value)]
      ]
    });
  });

  socket.on('temperature:sensor:new', temperature => {
    $scope.actualTemperature = temperature.value;
    $scope.update();
    chart.flow({
      columns: [
        ['x', new Date(temperature.date)],
        ['temperature', temperature.value]
      ]
    });
  });

  socket.on('temperature:sensor:alert', temperature => {
    console.log('ALERTE');
  });

  $scope.riseTemperature = function(temperature) {
    $scope.TemperatureWanted = temperature + 0.5;
    socket.emit('temperature:limit:new', $scope.TemperatureWanted, function(err) {
      if (!err) {
        console.log('OK');
      }
    });

  };

  $scope.lowTemperature = function(temperature) {
    $scope.TemperatureWanted = temperature - 0.5;
    socket.emit('temperature:limit:new', $scope.TemperatureWanted, function(err) {
      if (!err) {
        console.log('OK');
      }
    });
  };

  $scope.update = function() {
    $scope.$apply();
  };
});
