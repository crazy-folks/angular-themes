
angular.module('SubCategoryService', [])


.factory('subCategory', function($http) {

	// create a new object
	var subVaultFactory = {};

	// get a single vault
	subVaultFactory.get = function(id) {
		return $http.get('/api/SubCategory/one' + id);
	};

	// get all vault sub category
	subVaultFactory.all = function() {
		return $http.get('/api/SubCategory/');
	};

	// get all sub vault category belong to a main category id
	subVaultFactory.all = function(id) {
		// passed
		return $http.get('/api/SubCategory/' + id);
	};
	// return our entire sub vault Factory object
	return subVaultFactory;

});
