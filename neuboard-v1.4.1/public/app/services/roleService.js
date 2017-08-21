angular.module('roleService', [])

.service('Role', ['$http', function($http) {

	// create a new object
	var roleFactory = {};

	// get a single role
	roleFactory.get = function(id) {
		return $http.get('/api/roles/' + id);
	};

	// get all roles
	roleFactory.all = function() {
		return $http.get('/api/roles/');
	};

	// create a role
	roleFactory.create = function(roleData) {
		return $http.post('/api/roles/', roleData);
	};

	// update a role
	roleFactory.update = function(id, roleData) {
		return $http.put('/api/roles/' + id, roleData);
	};

	// delete a role
	roleFactory.delete = function(id) {
		return $http.delete('/api/roles/' + id);
	};

	roleFactory.getMe = function () {
	  return $http.get("/api/my_id");
	};

	// return our entire roleFactory object
	return roleFactory;

}]);