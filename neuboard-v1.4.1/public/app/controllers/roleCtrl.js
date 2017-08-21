angular.module('roleCtrl', ['roleService', 'ui.select'])

.controller('roleController', function (Role) {

  var vm = this;

  // set a processing variable to show loading things
  vm.processing = true;

  // grab all the roles at page load
  Role.all()
		.success(function (data) {

		  // when all the roles come back, remove the processing variable
		  vm.processing = false;

		  // bind the roles that come back to vm.roles
		  vm.roles = data;
		});
    
  // function to delete a role
  vm.deleteRole = function (id) {
    vm.processing = true;
    Role.delete(id)
			.success(function (data) {

			  // get all roles to update the table
			  // you can also set up your api 
			  // to return the list of roles with the delete call
			  Role.all()
					.success(function (data) {
					  vm.processing = false;
					  vm.roles = data;
					});

			});
  };

})

// controller applied to role creation page
.controller('roleCreateController', function (Role, $state) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'create';
  vm.access = [];
  vm.roleData = {
    "name": "",
    "modules": [],
    "dashboardSections": []
  };

  vm.switch = function () {
    if (vm.modules) {
      var entry;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          entry = item;
        }
      });
      if (!entry) {
        entry = { name: vm.modules, access: [] };
      }
      vm.access['get'] = !(entry.access.indexOf('get') < 0);
      vm.access['post'] = !(entry.access.indexOf('post') < 0);
      vm.access['put'] = !(entry.access.indexOf('put') < 0);
      vm.access['delete'] = !(entry.access.indexOf('delete') < 0);
      var added = false;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          item.access = entry.access;
          added = true;
        }
      });
      if (!added) {
        vm.roleData.modules.push(entry);
      }
      console.dir(vm.roleData.modules);
    }
  };

  vm.modify = function (element) {
    if (vm.modules) {
      var entry;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          entry = item;
        }
      });
      if (!entry) {
        entry = { name: vm.modules, access: [] };
      }
      var idx = entry.access.indexOf(element);
      if (idx >= 0 && !vm.access[element]) {
        entry.access.splice(idx, 1);
      } else if (idx < 0 && vm.access[element]) {
        entry.access.push(element);
      }
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          item.access = entry.access;
        }
      });
      console.dir(vm.roleData.modules);
    }
  };


  // function to create a role
  vm.saveRole = function () {
    vm.processing = true;
    vm.message = '';

    // use the create function in the roleServic
    Role.create(vm.roleData)
			.success(function (data) {
			  vm.processing = false;
			  vm.roleData = {};
			  $state.go('roles');
			});

  };

})

// controller applied to role edit page
.controller('roleEditController', function ($stateParams, $rootScope, $scope, $filter, Role) {

  var vm = this;

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'edit';
  vm.alerts = [];
  vm.access = [];
  vm.closeAlert = function (index) {
    vm.alerts.splice(index, 1);
  };

  // get the role data for the role you want to edit
  // $routeParams is the way we grab data from the URL
  var init = function () {
    Role.get($stateParams.name/*roleID*/)
		.success(function (data) {	  
      vm.roleData = data[0];
      
		});
  };

  vm.switch = function () {
    if (vm.modules) {
      var entry;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          entry = item;
        }
      });
      if (!entry) {
        entry = { name: vm.modules, access: [] };
      }
      vm.access['get'] = !(entry.access.indexOf('get') < 0);
      vm.access['post'] = !(entry.access.indexOf('post') < 0);
      vm.access['put'] = !(entry.access.indexOf('put') < 0);
      vm.access['delete'] = !(entry.access.indexOf('delete') < 0);
      var added = false;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          item.access = entry.access;
          added = true;
        }
      });
      if (!added) {
        vm.roleData.modules.push(entry);
      }
      console.dir(vm.roleData.modules);
    }
  };

  vm.modify = function (element) {
    if (vm.modules) {
      var entry;
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          entry = item;
        }
      });
      if (!entry) {
        entry = { name: vm.modules, access: [] };
      }
      var idx = entry.access.indexOf(element);
      if (idx >= 0 && !vm.access[element]) {
        entry.access.splice(idx, 1);
      } else if (idx < 0 && vm.access[element]) {
        entry.access.push(element);
      }
      vm.roleData.modules.forEach(function (item) {
        if (item.name == vm.modules) {
          item.access = entry.access;
        }
      });
      console.dir(vm.roleData.modules);
    }
  };

  init();

  // function to save the role
  vm.saveRole = function () {
    vm.processing = true;
    // call the roleService function to update 
    Role.update($stateParams.name/*roleID*/, vm.roleData)
			.success(function (data) {
			  vm.processing = false;
			  // bind the message from our API to vm.message
			  vm.alerts.push({ type: data.type, msg: data.message });

			  window.location.reload();
        
			});
  };


});

