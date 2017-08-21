angular.module('mainCtrl', [])

.controller('mainController', function ($scope, $state, $rootScope, $window, Auth, Socket, AgreementCategory, newProcessFac) {

  var vm = this;

  // get user information on page load
  if (!(vm.user)) Auth.getFullUser()    // modified from GetUser() to include user._id
    .then(function (data) {
      vm.user = data.data[0];
      Socket.emit('msg:user', vm.user._id);  // associate our socket with userid

      // Nguyen function to add userid to argeement table
      if(vm.user.userRoles[0] == 'Borrower') {
        //newProcessFac.addUserIdToPart(vm.user);
        AgreementCategory.modIdAgreement(vm.user)
          .success(function(data){
          // console.log(data);
        })
        newProcessFac.addUserIdToProcess(vm.user); 
      }

    });

  // added by Eric for socket notifications
  vm.messages = [];

  Socket.on('notify:update', function (msg) {
    vm.messages = [];

    msg.forEach(function (item) {
      vm.messages.push(item);
    })
  });

  // ---------------------------------------


  // get info if a person is logged in
  vm.loggedIn = Auth.isLoggedIn();

  // check to see if a user is logged in on every request
  $rootScope.$on('$stateChangeStart', function () {
    vm.loggedIn = Auth.isLoggedIn();

    // get user information on page load
    if (!(vm.user)) Auth.getFullUser()    // modified from GetUser() to include user._id
			.then(function (data) {
			  vm.user = data.data[0];
			  Socket.emit('msg:user', vm.user._id);  // associate our socket with userid
			});
  });

  // function to handle login form
  vm.doLogin = function () {
    vm.processing = true;

    // clear the error
    vm.error = '';

    Auth.login(vm.loginData.username, vm.loginData.password).then(
      function (data) {
			  vm.processing = false;
        // if a user successfully logs in, redirect to dashboard (instead of users) page
			  if (data.data.success) {
			    // $location.path('/users');
			    $state.go('dashboard');
          		   //location.reload();
        }
			  else {
          vm.error = data.data.message;

        }
			    

			});
  };

  // function to handle logging out
  vm.doLogout = function () {
    Auth.logout();
    vm.user = '';
    //$state.go('login');
    window.location.path('/');
  };

  vm.newUser = function () {
    console.log("New user added!");
    $scope.showRegister = true;
    //$state.go('newUser');
  };

  vm.saveNewUser = function () {
    console.log("in this save new user");
  }

})
.filter('fromNow', function () {
  return function (dateString) {
    return moment(parseInt(dateString)).fromNow();
  };
})

.directive('toggleLeftSidebar', function () {
  return {
    restrict: 'A',
    template: '<button ng-click="toggleLeft()" class="sidebar-toggle" id="toggle-left"><i class="fa fa-bars"></i></button>',
    controller: function ($scope, $element) {
      $scope.toggleLeft = function () {
        ($(window).width() > 767) ? $('#main-wrapper').toggleClass('sidebar-mini') : $('#main-wrapper').toggleClass('sidebar-opened');
      }
    }
  };
})
.directive('fullscreenMode', function () {
  return {
    restrict: 'A',
    template: '<button ng-click="toggleFullscreen()" type="button" class="btn btn-default expand" id="toggle-fullscreen"><i class="fa fa-expand"></i></button>',
    controller: function($scope, $element) {
      $scope.toggleFullscreen = function() {
        $(document).toggleFullScreen()
        $('#toggle-fullscreen .fa').toggleClass('fa-expand fa-compress');
      }
    }
  };
})
.directive('toggleProfile', function () {
  return {
    restrict: 'A',
    template: '<button ng-click="toggleProfile()" type="button" class="btn btn-default" id="toggle-profile"><i class="icon-user"></i></button>',
    controller: function($scope, $element) {
      $scope.toggleProfile = function() {
        $('.sidebar-profile').slideToggle();
      }
    }
  };
})
.directive('pageTitle', function ($rootScope, $timeout) {
  return {
    link: function(scope, element) {
      var listener = function(event, toState, toParams, fromState, fromParams) {
        var title = 'Kazume';
        if (toState.data && toState.data.pageTitle) title = 'Kazume | ' + toState.data.pageTitle;
        $timeout(function() {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  }
})
.directive('navToggleSub', function () {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.navgoco({
        caretHtml: false,
        accordion: true
      })
    }
  };
})
.filter('orderObjectBy', function(){
  return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
      array.push(input[objectKey]);
    }

    array.sort(function(a, b){
      a = parseInt(a[attribute]);
      b = parseInt(b[attribute]);
      return b - a;
    });
    return array;
  }
});
