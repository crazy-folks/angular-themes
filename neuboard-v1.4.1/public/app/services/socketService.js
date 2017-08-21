angular.module('socketService', [])
.factory('Socket', function ($rootScope, User) {
  var socket = io.connect(); // initialize connection

  // send user id to sockets api
  //User.getMe().success(function (data) {
  //  socket.emit('msg:user', data[0]._id);
  //});
  
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});