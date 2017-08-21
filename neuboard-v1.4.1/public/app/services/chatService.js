// MongoDB Chat Implementation
// Eric Odell - 8/1/2015

angular.module('chatService', [])
.service('Chat', [
  '$rootScope', '$http', '$q', 'User', 'Socket', 'Participant', function ($rootScope, $http, $q, User, Socket, Participant) {
    var allmessages = [],
      messages = [],
      participantGuid = [],
      participants = [],
      myUser = [];

    var initial1 = function() {
      var deferred = $q.defer();
      User.getMe().success(function (data) {
        myUser = data[0];
        $http.get('/api/participant/users/' + myUser._id)
        .then(function (data) {
          participants = data.data;
          deferred.resolve();
        });
      });
      return deferred.promise;
    };

    var add = function (scope, e) {
      if ((e.keyCode === 13 || e === 'submit') && scope.messageInput 
        && scope.participants.id && scope.participants.id.length > 0) {

        var toGuids = [];
        for (var i = 0; i < scope.participants.id.length; i++) {
          toGuids[i] = scope.participants.id[i]._id;
        }
        var msg = {
          name: myUser.name,
          guid: myUser._id,
          msg: scope.messageInput,
          to_id: toGuids,
          time: Date.now(),
          unread: true
        };

        $http({
          method: 'POST',
          url: "/api/chat",
          data: msg
        })
        .then(function () {
          toGuids.push(myUser._id);
          msg['all'] = toGuids;
          // Notify recipients
          Socket.emit('msg:update', msg);
          scope.messageInput = "";
        });

      }
    };

    var refresh = function(scope, data) {
      if (!myUser._id) return;
      $http({
        method: 'GET',
        url: "/api/chat/" + myUser._id
      }).then(function (d) {
        allmessages = d.data;
        messages = allmessages.filter(function (e) {
          // MESSAGE FILTER
          var toIDs = [];
          for (var i = 0; i < scope.participants.id.length; i++) {
            toIDs[i] = scope.participants.id[i]._id;
          }
          if (toIDs.length == 0) return false;
          toIDs.push(myUser._id);   // all participants ID's
          var current = [];
          e.to_id.forEach(function (i) {
            current.push(i);
          });
          current.push(e.guid);

          // determine equality (all participants are recipients of each message)
          return angular.equals(current.sort(), toIDs.sort());
          
        });
        scope.messages = messages;
      });
    };

    var getOne = function(userid){
        return $http.get('/api/participantAsMe/' + userid);
    };

    return {
      initial: $q.all({ init1: initial1() }),   // Resolve requirements before controller loads
      getParticipants: function () { return angular.copy(participants); },
      participantGuid: participantGuid,
      addMessage: function (scope, evt) { add(scope, evt); },
      refreshMessage: function (scope) { refresh(scope); },
      isMe: function (id) { return id === myUser._id; },
      getOne:function (id) {return getOne(id);}
    };
  }
]);