angular.module('agreementCatService', [])

.factory('AgreementCategory', function($http) {
	var agreementFactory = {};
	
	agreementFactory.createAgrCat = function(agreementDataSent) {
		//console.log(agreementDataSent);
		return $http.post('/api/agreementCreate', agreementDataSent);
	};

	agreementFactory.delete = function(data) {
		return $http.delete('/api/Argeements/' + data._id);
	};

	agreementFactory.sendingMailOut = function(data){
		return $http.post('/api/sendingMail', data);
	}
		
	agreementFactory.loadAll = function(id){
		return $http.get('/api/allSharedFiles/' + id);
	}

	agreementFactory.changeStatus = function(data) {
		return $http.post('/api/sharedFiles/' + '111', data);
	}

	agreementFactory.extendAgreementTime = function(id, state) {
		return $http.post('/api/extendtime/' + id + '/' + state);
	}

	agreementFactory.loadCategoryDescriptor = function (data) {
		return $http.get('/api/loadCategoryDescriptor/' + data.subscriberid + '/' + data.vaultcategoryid);
	}

	agreementFactory.modIdAgreement = function(user){
		return $http.post('/api/modIdAgreement', user);
	}

	agreementFactory.getUserNotification = function(email){
		return $http.get('/api/Notification/' + email);
	} 

	agreementFactory.deleteNotification = function(id){
		return $http.delete('/api/Notification/' + id);
	}

	agreementFactory.getUserIdOfAgreement = function(email){
		return $http.get('/api/getUserIdOfAgreement/' + email);
	}

	
	// return our entire userFactory object
	return agreementFactory;

});