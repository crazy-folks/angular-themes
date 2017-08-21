angular.module('agreementCtrl',['ui.bootstrap'])
  .controller('agreementController', ['$scope', '$uibModal', '$filter', '$q', 'Participant', 'User', 'Files', 'Agreement',function( $scope, $uibModal, $filter, $q, Participant, User, Files, Agreement) {
    // Controller entry point
    console.log("Agreements Controller");
    var vm = this;
    vm.processing = true;
    
    // function to get agreements of this user based userid
    var getAgreements = function() {
      // get the user_id to pass in the api get argeement
      User.getMe().then(function (data) {
        Agreement.userAgreement(data.data[0]._id).then(function (data) { //Identical to User
        //console.dir(data);
        console.log(data.data);
        vm.processing = false;
        // bind the users that come back to vm.agreements
        $scope.agreementlist = data.data;
        //vm.agreements = data;
        }); 
      });
    };
    
    getAgreements(); // call function when loading the page

    //Delete agreement
    vm.deleteAgreement = function (id) {
      vm.processing = true;
      Agreement.delete(id)
      .success(function (data) {
        // need a alert some where to indicate suceesfully delete an argeement 
        getAgreements();
      });
    };
  }])

  //Add agreement
  .controller('agreementCreateController', function (Participant,Agreement,User, $scope, $q ) {
    //Test agreement
    var agreementtest =     {
      "name": "Test",
      "description": "A test dataset not from mongo",
      "scope": "",
      "category": "Family",
      "type": "",
      "processid": "",
      "vaultvalueid": "",
      "vaultcategoryid": "",
      "vaultsubcategoryid": "",
      "readonlyaccess": "false",
      "getupdates": "true",
      "startdatetime": "1",
      "enddatetime": "1",
      "sharesubscribers": [] ,
      "actiondatetime": "2",
      "subscriberid": "kyung",
    };  
    var vm = this;
    vm.type = 'create';

    ///Obtaining Cetegory and Participant data for form(from Participant Service)
    console.log("Loading Categories and Participants");
    $scope.isSelected = {};
    $scope.openPanel = '';
    var users = [];
    vm.processing = true;
    $q.when().then(function () {
      var deferred = $q.defer();
      Participant.initial.then(function () {
        deferred.resolve();
      });
      return deferred.promise;
    }).then(function () {
      $scope.sorted = Participant.getCategories();
      users = Participant.getLinkedUsers();
    }).then(function () {
      // Flag the linked participants for chat
      var emails = [];
      users.forEach(function (user) {
        emails.push(user.email);
      });
      $scope.sorted.forEach(function (cat) {
        cat.participants.forEach(function (person) {
          var idx = emails.indexOf(person.email);
          if (idx >= 0) {
            person.subscriberid = users[idx]._id;
          }
        })
      })
      vm.processing = false;
      $scope.MainCategory = $scope.sorted;
      console.log($scope.MainCategory);
     // console.log("Users: " + JSON.Stringify(users));
    });
    //Finished Obtaining Category and Participant data

    $scope.newagreement = {
      "name": "",
      "description": "",
      "scope": "",
      "category": "",
      "type": "",
      "processid": "",
      "vaultvalueid": "",
      "vaultcategoryid": "",
      "vaultsubcategoryid": "",
      "readonlyaccess": "false",
      "getupdates": "true",
      "startdatetime": "",
      "enddatetime": "",
      "sharesubscribers": [] ,
      "actiondatetime": "",
      "subscriberid": "kyung",
    };
    // function to create a agreement
    vm.saveAgreement = function () {
      vm.processing = true;
      vm.message = '';
      //console.log(vm.newagreement);
      //interrrupt if missing required data.
      // use the create function in the userService
      User.getMe().then(function (data) {
        vm.newagreement.subscriberid = data.data[0]._id;
        //console.log("subscriberid " + vm.newagreement.subscriberid);
         console.log(vm.newagreement);
         Agreement.create(vm.newagreement).then(function (data) { //Identical to User
            vm.processing = false;
            console.log("Successful agreement post ");
            //console.log("Alerts: " + JSON.stringify(data));
            //console.log("Alerts.data: " + JSON.stringify(data.data));
            $scope.alerts = data.data;  //may not display multiple alerts (not tested)
            //vm.alerts.push({ type: data.type, msg: data.message });
            //window.location.reload();
        });
      }); 
    };
  })
  //End Add Agreement

  //Edit Agreement
  .controller('agreementEditController', function (Participant,Agreement,User, $q, $stateParams) {    
      var vm = this;

      // variable to hide/show elements of the view
      // differentiates between create or edit pages
      vm.type = 'edit';
      vm.alerts = [];
      vm.closeAlert = function (index) {
        vm.alerts.splice(index, 1);
      };

      ///Obtaining Cetegory and Participant data for form(from Participant Service)
      console.log("Loading Categories and Participants");
      var users = [];
      vm.processing = true;
      $q.when().then(function () {
        var deferred = $q.defer();
        Participant.initial.then(function () {
          deferred.resolve();
        });
        return deferred.promise;
      }).then(function () {
        vm.sorted = Participant.getCategories();
        users = Participant.getLinkedUsers();
      }).then(function () {
        // Flag the linked participants for chat
        var emails = [];
        users.forEach(function (user) {
          emails.push(user.email);
        });
        vm.sorted.forEach(function (cat) {
          cat.participants.forEach(function (person) {
            var idx = emails.indexOf(person.email);
            if (idx >= 0) {
              person.subscriberid = users[idx]._id;
            }
          })
        })
        vm.processing = false;
        vm.MainCategory = vm.sorted;
        console.log(vm.MainCategory);
       // console.log("Users: " + JSON.Stringify(users));
      });
      //Finished Obtaining Category and Participant data

     Agreement.getOne($stateParams.agreement_id)
      .success(function(data) { 
       console.log(data);
          vm.newagreement = data;
    });
   

      // function to save the user
    vm.saveAgreement = function () {
        vm.processing = true;

        // call the userService function to update 
        Agreement.update($stateParams.user_id, vm.userData)
          .success(function (data) {
            vm.processing = false;
            vm.alerts.push({ type: data.type, msg: data.message });

            window.location.reload();
            console.log("Successful agreement edit "+ JSON.stringify(data));
          });
    };
  });

