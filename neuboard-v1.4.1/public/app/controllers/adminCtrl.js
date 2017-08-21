angular.module('adminCtrl', [])
.controller('adminController', ['Admin', 'Role', 'ngToast', function (Admin, Role, ngToast) {
  var vm = this;

  vm.filteredLicenses = [];
  vm.currentPage = 1;
  vm.maxSize = 5;
  vm.numPerPage = 10;

  Admin.codes().success(function (data) {
    vm.codes = data;
  });

  Admin.licenses().success(function (data) {
    vm.licenses = data.license;

    vm.numLicenses = vm.licenses.length;

    vm.numPages = function () {
      return Math.ceil(vm.numLicenses / vm.numPerPage);
    };

    vm.changePage = function () {
      var begin = ((vm.currentPage - 1) * vm.numPerPage)
        , end = begin + vm.numPerPage;
      vm.filteredLicenses = vm.licenses.slice(begin, end);
    };
    vm.changePage();
  });

  Role.all().success(function (data) {
    vm.roles = data;
  });

  vm.addNewCode = function () {
    if (vm.role) {
      Admin.newCode(vm.role).success(function (data) {
        if (data.success) {
          ngToast.create({className: 'success', content: "Successfully added a new Add Code."});
          vm.codes.push({code: data.code, role: data.role});
        } else {
          ngToast.create({className: 'danger', content: "Couldn't add new Add Code: " + data.message});
        }
      });
    }
  };


}]);