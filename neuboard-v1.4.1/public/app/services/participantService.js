angular.module('participantService', [])
.service('Participant', ['$http', '$q', '$filter', 'User', function ($http, $q, $filter, User) {
  // var myUser = [],
  //   categories = [],
  //   sort = [],
  //   users = [];
 
  // var initial = $q.when()
  // .then(function () {
  //   var deferred = $q.defer();
  //   User.getMe().then(function (data) {
  //     myUser = data.data[0];
  //     deferred.resolve(myUser._id);
  //   });
  //   return deferred.promise;
  // }).then(function (id) {
  //   var deferred = $q.defer();
  //   $http.get('/api/participant/' + id).then(function (data) {
  //     categories = data.data;
  //     deferred.resolve(id);
  //   });
  //   return deferred.promise;
  // }).then(function (id) {
  //   var deferred = $q.defer();
  //   $http.get('/api/participant/users/' + id)
  //   .then(function (data) {
  //     users = data.data;
  //     deferred.resolve();
  //   });
  //   return deferred.promise;
  // });
  
  // var update = function (data) {
  //   var deferred = $q.defer();
  //   $http.put('/api/participant/' + myUser._id, data)
  //     .then(function (data) {
  //       deferred.resolve(data);
  //     });
  //   return deferred.promise;
  // };

  // var check = function (email) {
  //   var deferred = $q.defer();
  //   $http.get('/api/participant/usercheck/' + email)
  //   .then(function (data) {
  //     deferred.resolve(data);
  //   });
  //   return deferred.promise;
  // };

  // //Nguyen's function to get all participants of this userid
  // var getParts = function (userid){
  //   var deferred = $q.defer();
  //   $http.get('/api/participants/' + userid)
  //   .then(function (data) {
  //     deferred.resolve(data);
  //   });
  //   return deferred.promise;
  // };
  // // end Nguyen's function

  // return {
  //   initial: initial, // Sequential requirements execution
  //   getCategories: function () { return categories; },
  //   pushCategories: function (data) { return update(data); },
  //   getLinkedUsers: function () { return users; },
  //   checkLink: function (email) { return check(email); },
  //   getParticipants: function (userid) { return getParts(userid); },
  //   getUser: function(){return $http.get('api/my_id');}
  // }

  // create a new object
  var participantFactory = {};

  // get categories
  participantFactory.getCategories = function(id) {
    return $http.get('/api/participant/' + id);
  };

  // get participants of userid
  participantFactory.getParticipants = function(id) {
    return $http.get('/api/participants/' + id);
  };

  // get linked users
  participantFactory.getLinkedUsers = function(id) {
    return $http.get('/api/participant/users/' + id);
  };

  // check link
  participantFactory.checkLink = function(email) {
    return $http.get('/api/participant/usercheck/' + email);
  };

  // update a categories (formerly known as pushCategories)
  participantFactory.update = function(id, categoryData) {
    return $http.put('/api/participant/' + id, categoryData);
  };

  // create a participant
  participantFactory.create = function(participantData) {
    return $http.post('/api/participant/', participantData);
  };

  // delete a participant
  participantFactory.delete = function(id) {
    return $http.delete('/api/participant/' + id);
  };

  participantFactory.getMe = function () {
    return $http.get("/api/my_id");
  }

  participantFactory.addNewPartProcess = function (userid, newParticipant) {
    return $http.get("/api/addNewPartProcess/" + userid + '/' + newParticipant.email + '/' + newParticipant.displayname + '/' + newParticipant.subscriberid);
  }
  // return our entire participantFactory object
  return participantFactory;
}])