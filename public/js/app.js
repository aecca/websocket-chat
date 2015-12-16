/**
 * Application
 * @type {[type]}
 */
var app = angular.module('app', ['btford.socket-io']);


/**
 * Socket IO
 */
app.factory('socket', function (socketFactory, $window) {
  var app = $window.mApp;
  return socketFactory({
    prefix: '',
    ioSocket: io.connect()
  });
});

