angular.module('sidebarCtrl', [])

  .controller('sidebarController', function (User, Role, $scope, AgreementCategory,$uibModal) {

    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    User.getMe()
      .success(function (data) {
        var userRole = data[0].userRoles;

        //Nguyen's function to show notification
        AgreementCategory.getUserNotification(data[0].email)
        .success(function(data){

          if(data.length > 0) {
            /*var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/app/views/pages/agreements/partial/notify.html',
                    controller: 'notifyCtrl',
                    size: 'sm',
                    backdrop : 'static',
                    resolve: {
                        notifications: function() {
                            //console.log($scope.participants);
                            return data;
                        }
                    }
                });*/
          $scope.notifications = data;
          }
        })

        $scope.deleteNotification = function(idx) {
        var not_to_delete = $scope.notifications[idx];
        AgreementCategory.deleteNotification(not_to_delete._id)
        .success(function(data){
          $scope.notifications.splice(idx, 1);
          /*if($scope.notifications.length == 0) {
             $scope.cancel();
          }*/
        })
      }
        // End of Nguyen's function

        Role.get(userRole[0])
          .success(function (roleData) {
            var modNames = roleData[0].modules;
            if (checkIfExists("dashboard", modNames)) {
              $scope.dashboard_mod = "truthy";
            }
            if (checkIfExists("vault", modNames)) {
              $scope.vault_mod = "truthy";
            }
            if (checkIfExists("participants", modNames)) {
              $scope.participants_mod = "truthy";
            }
            if (checkIfExists("processes", modNames)) {
              $scope.processes_mod = "truthy";
            }
            if (checkIfExists("files", modNames)) {
              $scope.files_mod = "truthy";
            }
            if (checkIfExists("agreements", modNames)) {
              $scope.agreements_mod = "truthy";
            }
            if (checkIfExists("users", modNames)) {
              $scope.users_mod = "truthy";
            }
            if (checkIfExists("roles", modNames)) {
              $scope.roles_mod = "truthy";
            }
            if (checkIfExists("admin", modNames)) {
              $scope.admin_mod = "truthy";
            }
          });
      });
    var checkIfExists = function (name, collection) {
      if (collection && Object.prototype.toString.call(collection) === '[object Array]') {
        var idx = -1;
        collection.forEach(function (item) {
          if (item.name == name) {
            idx = item.access.indexOf('get');
          }
        });
        return (idx > -1);
      }
    };
  })

/*.controller('notifyCtrl', ['notifications', '$uibModalInstance', '$scope', 'AgreementCategory', function(notifications,$uibModalInstance, $scope, AgreementCategory) {
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.notifications = notifications;

}]);*/

