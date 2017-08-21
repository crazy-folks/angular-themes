var module = angular.module('vaultCtrl', ['ui.bootstrap', 'ui.router', 'desVaultService', 'ui.mask', 'ngFileUpload', 'pdf', 'isteven-multi-select', 'agreementCatService', 'ngAnimate'])

module.controller('vaultController', ['Category', '$scope', '$rootScope', 'desVault', '$filter', 'ngToast', '$http', 'AgreementCategory', 'Files', '$uibModal', '$sce', function(Category, $scope, $rootScope, desVault, $filter, ngToast, $http, AgreementCategory, Files, $uibModal,$sce) {

   

    //[paging field value]
    


    // return the user id to perpare for fetching vault items
    $scope.init = function() {
        Category.initial().then(function(data) {
            $scope.getCats();
        });
    };
    $scope.init();

    // ------------------------------------------------------------
    // This is functions for category 

    // function to get user categories
    $scope.getCats = function() {
        $scope.processing = true;
        Category.getCategories()
            .then(function(data) {
                $scope.categories = data.data;
                $scope.processing = false;
            })
    }

    $scope.opened = function(item, index) {
        openPanel(true, "descriptorView")
        $scope.descriptor = item;
        $scope.getDescriptorItem(item.subscriberid, item._id);
    }
    //prep step for adding new category
    $scope.addCategory = function() {
        openPanel(true, "addCategory");
        $scope.data = {};
        $scope.data.vault = {};
    }

    // insert the category
    $scope.insertCategory = function(data) {
        Category.createCategory(data);
        categoryChange();
    }

    // reload the get category function
    $scope.$on('change', function() {
        $scope.getCats();
    });

    // to open the panel
    function openPanel(show, name) {
        //console.log(show + " " + name);
        $scope.showPanel = show;
        $scope.panel = name;
    }

    // prep step for edit category
    $scope.editCategory = function(category) {
        openPanel(true, "editCategory");
        $scope.categoryData = category;
    }

    // call function to update category
    $scope.updateCategory = function(id, data) {
        Category.updateCategory(id, data);
        openPanel(false, "addCategory");
    }

    //prep step to delete category
    $scope.deleteCategory = function(category) {
        $scope.deleteItem = category;
        $scope.cancel(); // prevent do something else while delete
    }

    // to delete the category
    $scope.confirmDelete = function(data) {
        Category.deleteCategory(data._id);
        categoryChange();
    }

    // boardcast the change of delete and function to call function to get categories
    function categoryChange() {
        openPanel(false, "addCategory");
        $rootScope.$broadcast('change');
        $scope.closeAlerts();
    }

    // helper function to close panel
    $scope.cancel = function() {
        $scope.showPanel = false;
    }

    // close alert in delete function
    $scope.closeAlerts = function() {
            $scope.deleteItem = null; // cancel delete for category
            $scope.deleteSubItem = null;
            $scope.deleteVaultItem = null;
            $scope.deleteFCatItem = null;
        }
        // end of category
        // ------------------------------------------------------------


    // ------------------------------------------------------------
    // This is functions for sub category 
    /*
    // prep step for adding sub category
    $scope.addSubCategory = function(category) {
        openPanel(true, "addSubCategory");
        $scope.dataCategory = category;
    }

    $scope.insertSubVault = function(category, subData) {
        Category.createSub(category._id, subData);
        categoryChange();
    }

    $scope.editSubCategory = function(category, subData) {
        openPanel(true, "descriptorView")
        $scope.dataMain = category;
        $scope.categoryData = subData;

        // function to load descriptor item
        $scope.desData = null;
        $scope.descriptor = subData;
        $scope.getDescriptorItem(category.subscriberid, subData.id);
    }

    $scope.updateSubVault = function(id, categoryData) {
        Category.updateSub(id, categoryData);
    }

    $scope.deleteSubCategory = function(category, subData) {
        $scope.deleteSubItem = subData;
        $scope.dataAnother = category;
        $scope.cancel();
    }

    $scope.confirmDeleteSub = function(category, subData) {
            Category.deleteSub(category._id, subData);
            categoryChange();
        } */
        // end of sub category
        // ------------------------------------------------------------

    //-------------------------------------------------------------
    // descriptor function
    $scope.fieldsData = [{
        'code': 'DD/MM/YYYY',
        'option': 'Date',
        'mask': 'date'
    }, {
        'code': '(999) 999-9999',
        'option': 'Phone',
        'mask': 'phone'
    }, {
        'code': '(999) 999-9999? x99999',
        'option': 'Phone-ext',
        'mask': 'phone-ext'
    }, {
        'code': '+33 999 999 999',
        'option': 'Phone-int',
        'mask': 'phone-int'
    }, {
        'code': '99-9999999',
        'option': 'Tax Id',
        'mask': 'taxid'
    }, {
        'code': 'a*-999-a999',
        'option': 'Product Key',
        'mask': 'product-key'
    }, {
        'code': '99%',
        'option': 'Percent',
        'mask': 'percent'
    }, {
        'code': '$0',
        'option': 'Currency',
        'mask': 'currency'
    }, {
        'code': 'text',
        'option': 'Text'
    }, {
        'code': 'x@gmail.com',
        'option': 'Email'
    }, {
        'code': '999-99-9999',
        'option': 'SSN'
    }, {
        'code': '****',
        'option': 'password'
    }];
    $scope.email = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;



    $scope.addVaultValue = function() {
        $scope.showFields = true;
        $scope.data = {};
    }

    $scope.addDescriptor = function(subData, vaultValue, valueType, emailValue, dateValue) {
        //console.log(vaultValue);
        if (emailValue != undefined && valueType == 'Email') {
            vaultValue.value = emailValue;
        } else if (dateValue != undefined && valueType == 'Date') {
            vaultValue.value = dateValue;
        }
        $scope.showFields = false;
        vaultValue.subscriberid = subData.subscriberid;
        vaultValue.categoryid = subData._id;
        vaultValue.type = valueType;
        //console.log(vaultValue);
        desVault.createDescriptor(vaultValue);
        $rootScope.$broadcast('descriptor', {
            temp: {
                vaultValue
            }
        });

    }

    $scope.$on('descriptor', function(event, args) {
        $scope.Args = args.temp.vaultValue;
        $scope.getDescriptorItem($scope.Args.subscriberid, $scope.Args.categoryid);
    })

    $scope.getDescriptorItem = function(userid, id) {
        $scope.userid = userid;
        desVault.getDescriptor(userid, id)
            .then(function(data) {
                $scope.desVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filterDes = [];
                $scope.descriptorData = data.data;
                $scope.numDes = data.data.length;
                $scope.numPages = function () {
                    return Math.ceil($scope.numDes / $scope.desVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.desVar.currentPage - 1) * $scope.desVar.numPerPage)
                    , end = begin + $scope.desVar.numPerPage;
                    $scope.filterDes = $scope.descriptorData.slice(begin, end);
                };
                $scope.changePage();
            })
    }

    $scope.deleteVaultValue = function(descriptor) {
        $scope.deleteVaultItem = descriptor;
        $scope.message = null;
    }

    $scope.confirmDeleteVault = function(vaultValue) {
        desVault.deleteDescriptor(vaultValue._id);
        $rootScope.$broadcast('descriptor', {
            temp: {
                vaultValue
            }
        });
        $scope.closeAlerts();
    }

    $scope.editDescriptorValue = function(item) {
        $scope.desData = item;
        $scope.temp = {}; 
    }

    $scope.editVaultValue = function(vaultValue, valueType, data) {
        var temp = "";
        if (valueType == 'Date') {
            temp = data.newDateValue;
        } else if (valueType == 'Email') {
            temp = data.newEmailValue;
        } else {
            temp = data.newVaultValue;
        }
        vaultValue.vaultvalues[vaultValue.vaultvalues.length - 1].type = valueType;
        vaultValue.vaultvalues[vaultValue.vaultvalues.length - 1].value = temp;
        console.log(vaultValue);
        desVault.editDescriptor(vaultValue._id, vaultValue);
        $rootScope.$broadcast('descriptor', {
            temp: {
                vaultValue
            }
        });
        $scope.desData = null;
        // resest value
        $scope.temp = {};
        
    }

    $scope.requestActuallValue = function(item) {
        //console.log(item);
        Category.requestValue(item);
    }


    // end of descriptor function
    //--------------------------------------------------------------

    // date picker and modify function
    //--------------------------------------------------------------
    // functions for date picker
    $scope.today = function() {
        $scope.data = {
            "value": new Date()
        };
    };
    $scope.today();

    $scope.clear = function() {
        $scope.data = {
            "value": new Date()
        };
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events = [{
        date: tomorrow,
        status: 'full'
    }, {
        date: afterTomorrow,
        status: 'partially'
    }];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };
    // edn of datepicker functions

    $scope.toPassWordType = function(data) {
        var string = "";
        for (var i = 0; i < 6; i++) {
            string += '*';
        }
        $scope.parseString = string;
    }

    $scope.toNormalDate = function(data) {
            $scope.normalDate = $filter('date')(data, "MM/dd/yyyy");
        }
        //end of datepicker
        //--------------------------------------------------------------

    $scope.compareDate = function(data) {
       if ((new Date(data).getTime()) <= (new Date().getTime())) {
            $scope.result = true;
        } else {
            $scope.result = false;
        }
    }

    $scope.checkDescriptorValue = function (data){
        if(data.type == 'Date') {
            $scope.descriptorReturn = $filter('date')(data.value, "MM/dd/yyyy");
        } else if (data.type == 'password') {
            var string = "";
            for (var i = 0; i < 6; i++) {
                string += '*';
            }
            $scope.descriptorReturn = string;
        } else {
            $scope.descriptorReturn = data.value;
        }
    } 
    //--------------------------------------------------------------
    function throwToast (type, message) {
        ngToast.create({
            className: type,
            content: message,
            dismissOnClick: true,
            dismissButton: true
        });
    }
    //--------------------------------------------------------

    //--------------------------------------------------------
    // functions for agreement in vault
    $scope.initSharing = function() {
        $scope.cancel();
        $scope.partName = [];
        $scope.processing = true;
        loadOtherShare();
        //loadMyShare();
    };

    $scope.deleteAgreementView = function(item) {
        AgreementCategory.delete(item)
            .success(function(data) {
                throwToast(data.type, data.message);
                loadOtherShare();
            });
    }


    function loadOtherShare() {
        Category.loadContent()
            .then(function(data) {
                $scope.processing = false;
                $scope.sharingData = data.data;
                $scope.fileVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filteredData = [];
                $scope.totalItems = data.data.length;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.fileVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.fileVar.currentPage - 1) * $scope.fileVar.numPerPage)
                    , end = begin + $scope.fileVar.numPerPage;
                    $scope.filteredData = $scope.sharingData.slice(begin, end);
                };
                $scope.changePage();   
                //console.log(data.data);
                $scope.sharingData.forEach(function(value) {
                    if ($scope.partName.indexOf(value.myName) == -1) $scope.partName.push(value.myName);
                });

                openPanel(true, "sharingView");
            });
    }

    $scope.categoryDetail = function (data) {
        AgreementCategory.loadCategoryDescriptor(data)
            .success(function(data) {
            // console.log(data);
               $scope.desInfo = data;
            });
    }

    $scope.findMyShare = function() {
        $scope.cancel();
        //$scope.partName = [];
        $scope.processing = true;
        loadMyShare();
    }

    $scope.deleteMySharedData = function(item){
        AgreementCategory.delete(item)
            .success(function(data) {
                throwToast(data.type, data.message);
                loadMyShare();
            });
    }

    function loadMyShare () {
        Category.loadMySharedData()
        .then(function(data){
            $scope.processing = false;
            $scope.mySharedData = data.data;
            openPanel(true, "mySharedDataView");
                $scope.fileVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filteredData = [];
                $scope.totalItems = data.data.length;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.fileVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.fileVar.currentPage - 1) * $scope.fileVar.numPerPage)
                    , end = begin + $scope.fileVar.numPerPage;
                    $scope.filteredData = $scope.mySharedData.slice(begin, end);
                };
                $scope.changePage();   
        })
    }

    $scope.extendTimeShare = function(item) {
        AgreementCategory.extendAgreementTime(item._id, 1)
        .success(function(dataReturn){
            throwToast(dataReturn.type, dataReturn.message);
        })
    }
    
    // ======================================================
    // functions for argeement page
    $scope.initAgreement = function() {
        Category.initial().then(function(data) {
            loadingAgreements();
        });
    }

    function loadingAgreements() {
        $scope.myid = Category.getMyId()._id;
        //console.log($scope.myid);
        Category.loadMyAllShared()
            .then(function(data) {
               // console.log(data.data);
                $scope.agrVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filteredAgr = [];
                $scope.totalItems = data.data.length;
                $rootScope.agreementFiles = data.data;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.agrVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.agrVar.currentPage - 1) * $scope.agrVar.numPerPage)
                    , end = begin + $scope.agrVar.numPerPage;
                    $scope.filteredAgr = $rootScope.agreementFiles.slice(begin, end);
                };
                $scope.changePage();
            });

    }

    $scope.deleteAgreement = function(item) {
        AgreementCategory.delete(item)
            .success(function(data) {
                throwToast(data.type, data.message);
                loadingAgreements();
            });
    }

    $scope.openAll = function() {
        $scope.openAgreementShare($rootScope.agreementFiles);
    }

    $scope.openAgreementShare = function(dataAgreement) {
        $scope.openModal = false;
        //console.log(dataAgreement);
        $scope.argeements = dataAgreement;
        if ($scope.argeements.length) {
            for (var i = 0; i < $scope.argeements.length; i++) {
               // console.log($scope.argeements[i].confirmStatus);
                if ($scope.argeements[i].confirmStatus == 'To Be Agreed') {
                    $scope.openModal = true;
                    break;
                }
            }
        } else {
            $scope.openModal = true;
        }
        if ($scope.openModal) {;
            var options = ({
                animation: $scope.animationsEnabled,
                templateUrl: '/app/views/pages/agreements/partial/agreement.html',
                controller: 'modalShareCtrl',
                size: 'lg',
                backdrop : 'static',
                resolve: {
                    argeementsData: function() {
                        return $scope.argeements;
                    }
                }
            });

            $uibModal.open(options).result.finally(function() {
                loadingAgreements();
            });
        } else {
            throwToast("info", "No agreement to confirm");
            $scope.agreementFiles = $rootScope.agreementFiles;
        }
    }

    // end of agreement functions
    //========================================================
}]);


module.controller('modalShareCtrl', ['$scope', '$uibModalInstance', 'argeementsData', 'ngToast', 'AgreementCategory', function($scope, $uibModalInstance, argeementsData, ngToast, AgreementCategory) {
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.argeementConfirm = argeementsData;

    function infoOut(type, message) {
        ngToast.create({
            className: type,
            content: message,
            dismissOnClick: true,
            dismissButton: true
        });
    }

    $scope.displayInfo = function() {
        infoOut("info", "You've agreed to the share agreement");
        //console.log($scope.argeementConfirm);
        AgreementCategory.changeStatus($scope.argeementConfirm)
            .success(function(data) {
                infoOut(data.type, data.message);
                $uibModalInstance.dismiss('cancel');
                loadingAgreements();
            })
    }


    function loadingAgreements() {
        $scope.myid = Category.getMyId()._id;
        //console.log($scope.myid);
        Category.loadMyAllShared()
            .then(function(data) {
               // console.log(data.data);
                $scope.agrVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filteredAgr = [];
                $scope.totalItems = data.data.length;
                $rootScope.agreementFiles = data.data;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.agrVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.agrVar.currentPage - 1) * $scope.agrVar.numPerPage)
                    , end = begin + $scope.agrVar.numPerPage;
                    $scope.filteredAgr = $rootScope.agreementFiles.slice(begin, end);
                };
                $scope.changePage();
            });

    }

}]);

//========================================================================
// function for sharing data 
module.directive('shareModalContent', function() {
    console.log("In the directive");
    return {
        controller: 'shareController'
    };
});

module.controller('shareController', ['$scope', 'Participant', '$rootScope', '$uibModal', 'Category', function($scope, Participant, $rootScope, $uibModal, Category) {

    $scope.todaydate = new Date();
    $scope.openShare = function(vaultData, $event) {

        $scope.open = function(size) {
            Category.initial().then(function() {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/app/views/pages/vault/partial/shareModal.html',
                    controller: 'ModalVaultCtrl',
                    size: size,
                    backdrop : 'static',
                    resolve: {
                        participants: function() {
                            //console.log($scope.participants);
                            return Category.getParticipants();
                        },
                        partData: function() {
                            //console.log($scope.participants);
                            return vaultData;
                        },
                        user: function() {
                            //console.log($scope.participants);
                            return Category.getMyId();
                        }
                    }
                });
            });
        };

        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
        $scope.open();
    }

}]);


module.controller('ModalVaultCtrl', ['$scope', '$uibModalInstance', 'participants', 'partData', 'user', 'Files', 'AgreementCategory', 'ngToast', 'Category', function($scope, $uibModalInstance, participants, partData, user, Files, AgreementCategory, ngToast, Category) {
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.participants = participants.data[0];
    $scope.dataToShare = partData;
    //console.log($scope.participants);
    //console.log(user);

    $scope.allParticipants = [];


    for (var i = 0; i < $scope.participants.categories.length; i++) {
        // only add if have participants inside a category
        if ($scope.participants.categories[i].participants.length > 0) {
            var Part = {};
            Part['shareName'] = $scope.participants.categories[i].name;
            Part['msGroup'] = true;
            $scope.allParticipants.push(Part);
            for (var j = 0; j < $scope.participants.categories[i].participants.length; j++) {
                var orParts = {};
                if ($scope.participants.categories[i].participants[j].subscriberid != undefined) {
                    //       orParts['icon'] = '<img src="http://upload.wikimedia.org/wikipedia/commons/8/8c/WorldWideWeb_Icon.png" /> ';
                    orParts['sharesubscribers'] = $scope.participants.categories[i].participants[j].subscriberid;
                };

                orParts['icon'] = '<img src="/assets/images/identity.png"/> ';
                orParts['shareName'] = $scope.participants.categories[i].participants[j].displayname;
                orParts['ticked'] = false;
                orParts['email'] = $scope.participants.categories[i].participants[j].email;
                $scope.allParticipants.push(orParts);

            }
            var exit = [];
            exit['msGroup'] = false;
            $scope.allParticipants.push(exit);
        }
    }

    // end of modify $scope.allParticipants

    $scope.startShared = function(data, property, timeshare, dataToShare) {
        property.timeshare = timeshare;
        if (dataToShare.filename) {
            delete dataToShare.file; // delete the file data
        }

        $scope.dataPara = dataToShare;
        angular.extend($scope.dataPara, property);
        //console.log(property);
        //console.log($scope.dataPara);
        // calling two api functions send email to others
        // and post data to the argeement database 
        var agreementSend = function() {
                for (var i = 0; i < data.length; i++) {
                    angular.extend(data[i], $scope.dataPara); //copy data
                    data[i].myName = user.name;
                    data[i].subscriberid = user._id;
                    //console.log(data[i]);
                    AgreementCategory.createAgrCat(data[i]) // only send email out when successfully create agreement
                        .success(function(dataReturn) {
                            ngToast.create({
                                className: dataReturn.type,
                                content: dataReturn.message,
                                dismissOnClick: true,
                                dismissButton: true
                            });
                            $uibModalInstance.dismiss('cancel');
                            // send out email to inform 
                            //sendEmailOut(dataReturn);

                        });
                } // end of for loop

            } // end of function agreement sent*/

        agreementSend();

        function sendEmailOut(data) {
            AgreementCategory.sendingMailOut(data)
                .success(function(value) {
                    ngToast.create({
                        className: value.type,
                        content: value.message,
                        dismissOnClick: true,
                        dismissButton: true
                    });
                    if (value.type == 'success') { // able to send email out
                        $uibModalInstance.dismiss('cancel');
                    }
                })
        }


    }; // end of start share function

    // functions for date picker
   $scope.today = function() {
    $scope.timeshare = new Date();
  };
  $scope.today();

  $scope.todaydate = new Date();
  $scope.clear = function() {
    $scope.timeshare = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

 
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };
  

}])

// end of sharing function
//========================================================================