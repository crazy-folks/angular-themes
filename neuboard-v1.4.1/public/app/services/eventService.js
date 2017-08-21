angular.module('eventService', [])
.service('Events', [
  '$rootScope', '$http', function ($rootScope, $http) {
    var events = [];

    var add = function (event) {
      $http.post("/api/event", event).success(function () {
        events.push(event);
        alert("EVENT: [" + JSON.stringify(event) + "]");
        $rootScope.$broadcast('events.update');
      }).error(function (err) {
        console.log("Error saving Event: " + err)
      });
    }

    var initial = $http.get("/api/event").success(function (data) {
      for (var i = 0; i < data.length; i++) {
        events.push(data[i]);
      }
      $rootScope.$broadcast('events.update');
    });

    return {
      initial: initial,
      addEvent: function (event) {
        add(event);
      },
      getEvents: function () {
        return events;
      }
    };
  }
]);