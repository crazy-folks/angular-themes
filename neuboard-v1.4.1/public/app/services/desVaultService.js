angular.module('desVaultService', [])
.service('desVault',['$rootScope', '$http','$q', 'ngToast', function($rootScope, $http,$q,ngToast) {
  	
  	var get = function(userid,id){
  		var deferred = $q.defer();
        $http.get('api/vaultitem/' + userid + "/one/" + id)
        .then(function (data) {
        	deferred.resolve(data);
     	});
     	return deferred.promise; 	  
  	};

  	var create = function(data){
  		$http.post('/api/vaultitem/', data)
  		.success(function (data, status, headers, config) {
      		inform(data.type,data.message);
      	})
      	.error(function (data, status, headers, config) {
        if (data) {
           inform(data.type,data.message);
        }
      });
  	};

  	function inform(type,message){
  		ngToast.create({ className: type, content: message});
  	};

  	var deleteItem = function(id){
  		$http.delete('api/vaultitem/' + id)
  		.success(function (data, status, headers, config) {
      		inform(data.type,data.message);
      	})
      	.error(function (data, status, headers, config) {
        if (data) {
           inform(data.type,data.message);
        }
      });
  	};

  	var edit = function(id,descriptor) {
  		$http.put('api/vaultitem/' + id, descriptor)
  		.success(function (data, status, headers, config) {
      		inform(data.type,data.message);
      	})
      	.error(function (data, status, headers, config) {
        if (data) {
           inform(data.type,data.message);
        }
      });
  	};

	
	return {
      getDescriptor: function (userid,id) { return get(userid,id);},
      createDescriptor:function(data) {return create(data);},
      deleteDescriptor:function(id) {return deleteItem(id);},
      editDescriptor:function(id,descriptor) {return edit(id,descriptor);}
    };

}]);

/*desVault.deleteOneLabel = function(data){
	return $http.delete('api/vaultitem/' + data._id + "/" + data.subscriberid + "/" + data.name);
}});*/