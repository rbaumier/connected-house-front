'use strict';

var app = angular.module('House', ['ui.bootstrap']);
app.filter('trusted', ['$sce', function($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
