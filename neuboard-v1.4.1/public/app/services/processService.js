angular.module('processService', [])
.service('Processes', [
  '$rootScope', '$http', function ($rootScope, $http) {
    var processes = [];

    var initialProcesses = $http.get("/api/process").success(function (data) {
      for (var i = 0; i < data.length; i++) {
        add(data[i]);
      }
    });

    var add = function (process) {
      processes.push(process);
      $rootScope.$broadcast('processes.update');
    };

    return {
      initial: initialProcesses,
      addProcess: function (process) {
        add(process);
      },
      getProcess: function () {
        return processes;
      },
      loanApp: $http.get('assets/jsonFiles/RealEstateApp.json'),
      newLoanApp: $http.get('assets/jsonFiles/RealEstateLoanEstimate.json'),
      getUser: function (email) {
        return $http.get('api/participant/emailcheck/' + email);
      }
    };
  }
]);