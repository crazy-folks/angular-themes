angular.module('panelService', [])
.service('Panel', ['$http', function($http) {

	// create a new object
	var panelFactory = {};

	// get a single panel
	panelFactory.get = function(id) {
		return $http.get('/api/panel/' + id);
	};

	// get all panels
	panelFactory.all = function() {
		return $http.get('/api/panel/');
	};

	// create a panel
	panelFactory.create = function(panelData) {
		return $http.post('/api/panel/', panelData);
	};

	// update a panel
	panelFactory.update = function(id, panelData) {
		return $http.put('/api/panel/' + id, panelData);
	};

	// delete a panel
	panelFactory.delete = function(id) {
		return $http.delete('/api/panel/' + id);
	};

	panelFactory.getMe = function () {
	  return $http.get("/api/my_id");
	}

	// return our entire panelFactory object
	return panelFactory;

}]);