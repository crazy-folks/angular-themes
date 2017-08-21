angular.module('panelCtrl', ['panelService', 'ui.select'])

.controller('panelController', function (Panel, User, Role, $scope) {
  $scope.panelUrls = [];
  var vm = this;
  var getSections = function() {

  	User.getMe().success(function(data){
      var userRole = data[0].userRoles;
      vm.role = userRole.toString().toLowerCase(); 
      Role.get(userRole[0]).success(function (roleData) {
    	  var dSections = roleData[0].dashboardSections;    
    	  // console.log("This is dSections " + dSections);

    	  for(var i = 0; i < dSections.length; ++i) {
    	  	var panel = dSections[i];
    	  	// console.log("iter at " + i + " " + panel);

          // Determine if user has access to this panel:


    	  	Panel.get(panel).success( function (data) {
    	  		// console.log("This is being pushed " + data[0].filePath);    	  		
    	  		$scope.panelUrls.push(data[0].filePath);
    	  	});
    	  }
      });
    });

  };

  getSections();

  // $scope.makePanelUrl = function(panel) {
  //   var panelUrl;
  //   Panel.get(panel).success( function (data) {
  //   	panelUrl = data.filePath;
  //   	console.log("this is panel url " +panelUrl);
  //   })
  //   return paneUrl;
  // }
});

// .directive("myPanel", function () {
//   return {
//     restrict: 'E',
//     scope: {
//       item: '='
//     },
//       template: '<ng-include src="&quot;{{item}}&quot;"></ng-include>'
//     }

// })
