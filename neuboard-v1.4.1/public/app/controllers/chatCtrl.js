angular.module('chatCtrl', ['ui.bootstrap', 'ui.select', 'ngSanitize'])

  .controller('chatController', ['$scope', '$uibModalInstance', 'User', 'Chat', 'Socket', 'user',
    function ($scope, $uibModalInstance, User, Chat, Socket, user) {
      $scope.messages = [];
      $scope.participants = {};
      $scope.participants.id = []; // Selected participants
      $scope.participants.all = Chat.getParticipants(); // All available participants

      $scope.$watch('participants.id', function (newVal, oldVal) {
        if (oldVal == newVal) return;
        Chat.refreshMessage($scope);
      }, true);
      if (user && user.length >= 1 && typeof user != 'string') {
        $scope.participants.all.length = 0;
        //console.log("1");
        for (var i = 0; i < user.length; i++) {
          //user[i]._id = user[i].sharesubscribers; // for person all part
          user[i]._id = user[i].cusid;
          user[i].name = user[i].cusName;
          $scope.participants.all.push(user[i]);
          Chat.refreshMessage($scope);
        }
        $scope.participants.id.push(user[0]);
      }

      else if (user && !user.length && typeof user != 'string') {
        //console.log("2");
        for (var i = 0; i < $scope.participants.all.length; i++) {
          if ($scope.participants.all[i]._id == (user.subscriberid || user._id || user.guid)) {
            $scope.participants.id.push($scope.participants.all[i]);
            Chat.refreshMessage($scope);
          }
        }
      } else if (typeof user == 'string') {
        //console.log("3");
        $scope.participants.all.length = 0;
        Chat.getOne(user)
          .success(function (data) {
            //$scope.participants.all.push(data);
            //console.log($scope.participants.all);
            $scope.participants.id.push(data);
            //console.log($scope.participants.id);
            Chat.refreshMessage($scope);
          })
      }

      $scope.isMe = function (data) {
        return Chat.isMe(data);
      };

      $scope.addMessage = function (e) {
        Chat.addMessage($scope, e);
      };

      Socket.on('msg:new', function (data) {
        console.log('Server sent new message.');
        $scope.messages.unshift(data);
      });

      $scope.ok = function () {
        $uibModalInstance.close();
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };


    }

  ])

  .controller('chatModalCtrl', ['$scope', '$uibModal', '$log', 'Chat', function ($scope, $uibModal, $log, Chat) {

    $scope.animationsEnabled = true;

    $scope.open = function (user, $event) {
      if ($event) {
        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();
        $event.cancelBubble = true;
        $event.returnValue = false;
      }
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/app/views/pages/participants/chatModal.html',
        controller: 'chatController',
        resolve: {
          'ChatData': function (Chat) {
            return Chat.initial;
          },
          'user': function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function () {

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  }])

  .directive('chatModalContent', function () {
    return {
      restrict: 'A',
      controller: 'chatModalCtrl'
    };
  });

