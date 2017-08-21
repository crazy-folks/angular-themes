
angular.module('userCtrl', ['ui.select', 'ui.bootstrap'])

.controller('userController', ['User', 'Role', 'ngToast', '$scope', function (User, Role, ngToast, scope) {

  var vm = scope;
  vm.filteredUsers = [];
  vm.currentPage = 1;
  vm.maxSize = 5;
  vm.numPerPage = 10;

  // set a processing variable to show loading things
  vm.processing = true;

  // grab all the users at page load
  User.all()
    .success(function (data) {

      // when all the users come back, remove the processing variable
      vm.processing = false;

      // bind the users that come back to vm.users
      vm.users = data;

      vm.numUsers = vm.users.length;

      vm.numPages = function () {
        return Math.ceil(vm.users.length / vm.numPerPage);
      };

      vm.changePage = function () {
        var begin = ((vm.currentPage - 1) * vm.numPerPage)
          , end = begin + vm.numPerPage;
        vm.filteredUsers = vm.users.slice(begin, end);
      };
      vm.changePage();
    });

  // function to delete a user
  vm.deleteUser = function (id) {
    vm.processing = true;
    User.delete(id)
      .success(function (data) {

        // get all users to update the table
        // you can also set up your api 
        // to return the list of users with the delete call
        User.all()
          .success(function (data) {
            vm.processing = false;
            vm.users = data;
            vm.changePage();
          });

      });
  };

}])

// controller applied to user creation page
.controller('userCreateController', function (User, Role, ngToast) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'create';

  //Todo edge case where no roles set yet
  var init = function() {
    Role.all().success(function (data) {
      vm.roleData = data;
    });
  };

  init();


  // function to create a user
  vm.saveUser = function () {
    vm.processing = true;
    vm.message = '';

    if (!vm.userData.name || !vm.userData.email || !vm.userData.username || !vm.userData.password || !vm.userData.userRoles) {
      ngToast.create({className: 'warning', content: 'Can\'t create user with the given information.'});
      return;
    }
    // use the create function in the userService
    User.create(vm.userData)
      .success(function (data) {
        vm.processing = false;
        vm.userData = {};
        vm.message = data.message;
      });

  };

})

// controller applied to new user page
.controller('newUserController', function (User) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'create';
  console.log("Using new user controller");
  

  // function to create a user
  vm.saveUser = function () {
    vm.processing = true;
    vm.message = '';
    console.log("save user called");

    // use the create function in the userService
    User.create(vm.userData)
      .success(function (data) {
        console.log("service called");
        vm.processing = false;
        vm.userData.userRoles = "Borrower";
        vm.userData = {};
        vm.message = data.message;
      });

  };

})

// controller applied to user edit page
.controller('userEditController', function ($stateParams, $state, $rootScope, $scope, User, Role, Files, ngToast) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'edit';

  // get the user data for the user you want to edit
  // $routeParams is the way we grab data from the URL
  var init = function () {
    User.get($stateParams.user_id)
    .success(function (data) {
      //console.log(data);
      Files.listImages($stateParams.user_id)
        .then(function (files) {
          //console.log(files);
          vm.userData = {};
          vm.files = files.data;
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              if (key == 'avatar') {
                vm.files.forEach(function (file, idx) {
                  if (file.filename == data['avatar']) {
                    vm.avatar = file;
                  }
                });
              } else {
                vm.userData[key] = data[key];
                if (key == 'userRoles') vm.userData.userRoles = data[key][0];
              }
            }
          }
        });
    });
  };

  init();

  //get role names
  var init2 = function() {
    if (!$state.includes('profile')) Role.all().success(function (data) {
      vm.roleData = data;
    });
   };

   init2();

  // function to save the user
  vm.saveUser = function () {
    vm.processing = true;

    // change avatar data to filename only:
    if(vm.avatar && vm.avatar.filename) {
      vm.userData.avatar = vm.avatar.filename;
    }
    
    // call the userService function to update 
    User.update($stateParams.user_id, vm.userData)
      .success(function (data) {
        vm.processing = false;
        // bind the message from our API to vm.message
        ngToast.create({ className: data.type, content: data.message });

        window.location.reload();
        
      });
  };

  vm.upload = function (file) {
    if (file) {
      if (file[0].type.substring(0, 5) != 'image') {
        ngToast.create({ className: 'danger', content: 'This is not a valid image file!' });
        return;
      }
      ngToast.create({ className: 'info', content: 'Uploading image...' });
      vm.files.push(file[0]);
      vm.avatar = file[0];

      // Upload file and success callback function:
      Files.uploadFiles(file, init, $stateParams.user_id);
    }
  };

  vm.deleteFile = function () {
    ngToast.create({ className: 'info', content: 'Deleting file: ' + vm.avatar.filename });
    // Remove file, and on success, call init:
    Files.remove(vm.avatar, init, $stateParams.user_id);
  }

});

// //controller for dashboard panels
// .controller('userPanelController', function (User, Role, $scope) {
//   User.getMe()
//     .success(function(data){
//       var userRole = data[0].userRoles;

//       Role.get(userRole[0])
//         .success(function (roleData) {
//           $scope.dashboardSections = roleData[0].dashboardSections;  //for panels on dashboard   
//       });
//     });

//   $scope.makePanelUrl = function(panel) {
//     var location = "/app/views/pages/dashboard/panels/";
//     var ending = "Panel.html";

//     console.log("this is the makepanelurl: " + location+panel+ending);
//     return location+panel+ending;
//   }
// })

// .directive("myPanel", function () {
//   return {
//     restrict: 'E',
//     scope: {
//       item: '='
//     },
//       template: '<ng-include src="&quot;app/views/pages/dashboard/panels/{{item}}Panel.html&quot;"></ng-include>'
//     }
  
// })