angular.module('participantCtrl', ['ui.bootstrap'])
.controller('participantController', ['$scope', '$uibModal', '$filter', '$q', 'Participant', 'User', 'Files', 'ngToast', 'AgreementCategory',
  function ($scope, $uibModal, $filter, $q, Participant, User, Files, ngToast, AgreementCategory) {
  // Controller entry point
  var vm = this;
  vm.processing = true;
  $scope.isSelected = {};
  $scope.openPanel = '';

  var users = [];

  // retrieve data from service

  vm.processing = true;


  User.getMe().success( function (data) {
      vm.myId = data[0]._id; // please don't modify this
     // console.log("This should be userid " + vm.myId);
      
      Participant.getCategories(vm.myId).success( function (catData) {
        $scope.sorted = catData; 
       // console.log("this is sorted"  + $scope.sorted);
      });

      // Nguyen's function to add lender as part of primary customer process
      // new lender as participant will be add to work categoy
      AgreementCategory.getUserIdOfAgreement(data[0].email)
        .success(function(data){
            User.get(data.subscriberid)
            .success(function(data){
              $scope.newParticipant = {
              "displayname": data.name,
              "email": data.email,
              "subscriberid": data._id   
            };
            Participant.addNewPartProcess(vm.myId,$scope.newParticipant)
            .success(function(data){
              if(data.type == 'success') {
                ngToast.create({className: data.type, content: data.message });
              }   
            })
            })
        });
      // end of Nguyen's function

      Participant.getLinkedUsers(vm.myId).success( function (usersData) {
        users = usersData;
       // console.log("this is users " + users);

        // Flag the linked participants for chat
        var emails = [];
        if (isValidArray(users)) users.forEach(function (user) {
          emails.push(user.email.toString().toLowerCase());
        });

        if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat) {
          if (isValidArray(cat.participants)) cat.participants.forEach(function (person) {
            var idx = emails.indexOf(person.email.toString().toLowerCase());
            if (idx >= 0) {
              person.subscriberid = users[idx]._id;
            }
          })
        });

        // Initialize down/right arrow flags
        $scope.status = { open: [] };
        if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (item) {
          $scope.status.open[item.name] = false;
        });

        vm.processing = false;
      });
  });


  // $q.when().then(function () {
  //   var deferred = $q.defer();
  //   Participant.initial.then(function () {
  //     deferred.resolve();
  //   });
  //   return deferred.promise;
  // }).then(function () {
  //   $scope.sorted = Participant.getCategories();
  //   users = Participant.getLinkedUsers();
  // }).then(function () {
  //   // Flag the linked participants for chat
  //   var emails = [];
  //   if (isValidArray(users)) users.forEach(function (user) {
  //     emails.push(user.email.toString().toLowerCase());
  //   });

  //   if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat) {
  //     if (isValidArray(cat.participants)) cat.participants.forEach(function (person) {
  //       var idx = emails.indexOf(person.email.toString().toLowerCase());
  //       if (idx >= 0) {
  //         person.subscriberid = users[idx]._id;
  //       }
  //     })
  //   })

  //   // Initialize down/right arrow flags
  //   $scope.status = { open: [] };
  //   if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (item) {
  //     $scope.status.open[item.name] = false;
  //   });

  //   vm.processing = false;
  // });

  
  // panel script start here 
  $scope.openAddParticipant = function (cat) {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    $scope.MainCategory = $scope.sorted;
    $scope.newParticipant = {
      "name": "",
      "address": "",
      "city": "",
      "state": "",
      "zip": "",
      "country": "",
      "phone": "",
      "fax": "",
      "email": "",
      "categoryname": cat.name || "",
      "owner": "",
      "notes": []
    };

    $scope.postParticipant = function () {
      if (!$scope.newParticipant.displayname) {
        ngToast.create({className: 'danger', content: 'Name required to add a participant!' });
        return;
      } else if (!$scope.newParticipant.email) {
        ngToast.create({className: 'danger', content: 'Email address required to add a participant!' });
        return;
      }
      User.getMe().then(function (data) {
        $scope.newParticipant.owner = data.data[0].displayname;

        var cat = $filter('filter')($scope.sorted, { name: $scope.newParticipant.categoryname }, function (a, b) { return a == b; });
        if (cat.length == 1) {
          var idx = $scope.sorted.indexOf(cat[0]);
          if (!$scope.sorted[idx].participants) {
            $scope.sorted[idx].participants = [];
          }
          Participant.checkLink($scope.newParticipant.email).then(function (data) {
            if (data && data.data && data.data._id) {
              $scope.newParticipant.subscriberid = data.data._id;
            }

            $scope.sorted[idx].participants.push(angular.copy($scope.newParticipant));
            Participant.update(vm.myId, $scope.sorted).then(function (data) {
              ngToast.create({className: 'success', content: 'Successfully added participant!' });
              $scope.openPanel = '';

            });
          })
 
        } else {
          ngToast.create({className: 'danger', content: 'Error adding participant!' });
        }       
      });
    };
    $scope.openPanel = 'addParticipant';
  };

  $scope.openAddCategory = function () {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    $scope.newCategory = {
      "name": "",
      "removable": true
    }
    $scope.postCategory = function () {
      if (!$scope.newCategory.name) {
        ngToast.create({className: 'danger', content: 'Category name required!' });
        return;
      }
      if (isValidArray($scope.sorted)) {
        var exists = false;
        $scope.sorted.forEach(function (category) {
          if (category.name == $scope.newCategory.name) {
            ngToast.create({ className: 'danger', content: 'Category name already exists!' });
            exists = true;
          }
        });
        if (!exists) {
          $scope.sorted.push($scope.newCategory);
          Participant.update(vm.myId, $scope.sorted).then(function (data) {
            ngToast.create({ className: 'success', content: 'Successfully added category \'' + $scope.newCategory.name + '\'!' });
            $scope.openPanel = '';
          });
        }
      }
      
    }
    $scope.openPanel = 'addCategory';
  };

  $scope.openViewParticipant = function (person) {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    $scope.viewParticipant = person;
    $scope.isSelected[person.displayname] = true;
    if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat) {
      if (cat.participants.indexOf(person) >= 0) { $scope.viewParticipant.MainCategory = cat.name; }
    });

    $scope.openPanel = 'viewParticipant';
  }

  $scope.openEditParticipant = function (person) {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    $scope.isSelected[person.name] = true;

    $scope.editParticipant = angular.copy(person);
    $scope.MainCategory = $scope.sorted;

    if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat) {
      if (isValidArray(cat.participants) && cat.participants.indexOf(person) >= 0) { $scope.editParticipant.categoryname = cat.name; }
    });

    $scope.save = function () {
      Participant.checkLink($scope.editParticipant.email).then(function (data) {
        if (data && data.data && data.data._id) {
          $scope.editParticipant.subscriberid = data.data._id;
        } else {
          $scope.editParticipant.subscriberid = '';
        }

        if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat, idx) {

          if (!cat.participants) cat.participants = [];
          if (isValidArray(cat.participants)) cat.participants.forEach(function (part, i) {
            if (part.displayname === $scope.editParticipant.displayname) {
              cat.participants.splice(i, 1);

            }
          })
          if (cat.name === $scope.editParticipant.categoryname) {
            $scope.sorted[idx].participants.push(angular.copy($scope.editParticipant));
          }

        });

        Participant.update(vm.myId, $scope.sorted).then(function (data) {
          ngToast.create({className: 'success', content: 'Successfully modified participant!' });
          $scope.openPanel = '';
        }, function (err) {
          ngToast.create({className: 'danger', content: 'Error modifying participant: ' + JSON.stringify(err) });
        });

      });

    };

    $scope.openPanel = 'editParticipant';
  };

  $scope.openDeleteParticipant = function (person, $event) {
    // Stop $event propagation to parent element (edit participant):
    if ($event) {
      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();
      $event.cancelBubble = true;
      $event.returnValue = false;
    }

    $scope.deleteperson = person;

    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    $scope.isSelected[person.displayname] = true;

    $scope.deleteParticipant = function () { //@TODO
      if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (cat) {
        if (isValidArray(cat.participants)) cat.participants.forEach(function (p, i) {
          if (p.displayname == $scope.deleteperson.displayname) {
            cat.participants.splice(i, 1);
          }
        });
      });

      Participant.update(vm.myId, $scope.sorted).then(function () {
        ngToast.create({className: 'success', content: 'Successfully deleted participant!' });
        $scope.openPanel = '';
      }, function () {
        ngToast.create({className: 'danger', content: 'There was a problem deleting this participant!' });
      });
    };
    $scope.openPanel = 'deleteParticipant';
  };

  $scope.openDeleteCategory = function (cat) {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }

    $scope.cat = cat;

    $scope.deleteCategory = function () { //@TODO
      // Delete category(id):
      
      if (isValidArray($scope.sorted)) $scope.sorted.forEach(function (category, i) {
        if (category.name == cat.name) {
          $scope.sorted.splice(i, 1);
          // Update DB
          Participant.update(vm.myId, $scope.sorted).then(function () {
            ngToast.create({ className: 'success', content: 'Successfully deleted category!' });
          });
        }
      });
      // Close panel
      $scope.openPanel = '';
    };
    $scope.openPanel = 'deleteCategory';
  };

  $scope.cancel = function () {
    for (var key in $scope.isSelected) {
      $scope.isSelected[key] = false;
    }
    // close panel
    $scope.openPanel = '';
  };

  $scope.addNote = function () {
    var panel;
    if ($scope.openPanel == 'editParticipant') panel = $scope.editParticipant;
    else panel = $scope.newParticipant;
    if (panel.note == "") {
      ngToast.create({ className: 'warning', content: 'Can\'t add blank note.' });
      return;
    }
    if (!isValidArray(panel.notes) || panel.notes == null) {
      panel.notes = [];
    }
    var note = {
      note: panel.note,
      time: Date.now()
    };
    panel.notes.push(note);
    ngToast.create({ className: 'success', content: 'Successfully added note: ' + panel.note + '.' });
    panel.note = "";
  };

  $scope.removeNote = function (idx) {
    var panel;
    if ($scope.openPanel == 'editParticipant') panel = $scope.editParticipant;
    else panel = $scope.newParticipant;

    if (!isValidArray(panel.notes)) {
      return;
    }
    panel.notes.splice(idx, 1);
    ngToast.create({ className: 'success', content: 'Successfully removed note.' });
    panel.note = "";
  };
  // end of panel script

  $scope.upload = function (file) {
    Files.initial.then(function () {
      Files.uploadFiles(file, $scope.alerts);
      
    });
  };

  // Verifies if an object is not null and of Array type.
  function isValidArray(obj) {
    return (obj != null && Object.prototype.toString.call(obj) === '[object Array]');
  };

}]);