angular.module('adminService', [])
.service('Admin', ['$http', function ($http) {

  // create a new object
  var adminService = {};

  adminService.codes = function () {
    return $http.get("/api/codes");
  };

  adminService.newCode = function (data) {
    return $http.post("/api/codes", {role: data});
  };

  adminService.licenses = function () {
    return $http.get('/api/admin/license');
  };

  return adminService;
}]);