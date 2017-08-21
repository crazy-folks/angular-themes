angular.module('agreementService', [])

.factory('Agreement', function($http) {

	// create a new object
	var agreementFactory = {};

	// get a single agreement
	agreementFactory.getOne = function(id) {
		//console.log(id);
		return $http.get('/api/agreements/' + id);
	};

	// get all agreements
	agreementFactory.all = function() {
		return $http.get('/api/agreements');
	};

	// get agreements of this userid
	agreementFactory.userAgreement = function(userid) {
		return $http.get('/api/agreements/user/' + userid);
	};

	// delete a agreement based on agreement id not user id 
	agreementFactory.delete= function(id) {
		// passed test here
		return $http.delete('/api/agreements/' + id);
	};

	// create a agreement
	agreementFactory.create = function(agreementData) {
		return $http.post('/api/agreements/', agreementData);
	};

	// update a agreement
	agreementFactory.update = function(id, agreementData) {
		return $http.put('/api/agreements/' + id, agreementData);
	};

    // new function with user id include 
    // get all agreement according to user id
	agreementFactory.all = function(id){
		return $http.get('/api/agreements/' + id);
	} 
	
	//Nguyen's agreement service for category
	agreementFactory.createAgrCat = function(agreementData) {
		return $http.post('/api/agreementCategory/', agreementData);
	};

	// end of Nguyen's argreement 

	// return our entire userFactory object
	return agreementFactory;

});
