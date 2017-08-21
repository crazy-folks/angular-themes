angular.module('processCtrl', ['ngWizard', 'isteven-multi-select', 'newProcessService','ui.bootstrap','tc.chartjs', 'ui.mask'])
    .controller('processController', ['$scope', '$stateParams', 'Processes', '$location', 'ngToast', 'newProcessFac', 'AgreementCategory', '$rootScope', '$uibModal', '$filter', '$state', '$http', 'Category',
        function($scope, $stateParams, Processes, $location, ngToast, newProcessFac, AgreementCategory,$rootScope,$uibModal,$filter,$state,$http, Category) {
            var processLimit = 3;
            var form = {};
            form['template'] = {};
            form['parsed'] = {};
            form['model'] = {};

            $scope.open = {
                participants: true,
                sharing: false,
                chat: false,
                screen: false
            };

            $scope.process = Processes.getProcess();
            $scope.dashboardProcess = ($scope.process.length > processLimit) ? $scope.process.slice(0, processLimit) : $scope.process;

            $scope.savePartial = function(partial) {
                if($rootScope.myRole == 'Borrower') {
                    newProcessFac.saveProcess(form.model, $rootScope.processid, $rootScope.processCatName, $rootScope.proName, $rootScope.processOwnerId, partial, $rootScope.proName);
                }  else if($rootScope.myRole == 'Lender') {
                    newProcessFac.lenderSaveData(form.model, $rootScope.processid,$rootScope.processCatName,$rootScope.proName, $rootScope.processOwnerId,$rootScope.queryID, $rootScope.queryName, partial, $rootScope.proName);
                }


            }


            $scope.submit = function() {
                console.dir(form.model);

                if($rootScope.myRole == 'Borrower') {
                    newProcessFac.saveProcess(form.model, $rootScope.processid, $rootScope.processCatName, $rootScope.proName, $rootScope.processOwnerId, "main", $rootScope.proName);
                }  else if($rootScope.myRole == 'Lender') {
                    /*console.log(form.model);
                     console.log($rootScope.processid);
                     console.log($rootScope.processCatName);
                     console.log($rootScope.proName);
                     console.log($rootScope.processOwnerId);
                     console.log($rootScope.queryID);*/
                    newProcessFac.lenderSaveData($scope.model, $rootScope.processid,$rootScope.processCatName,$rootScope.proName, $rootScope.processOwnerId,$rootScope.queryID, $rootScope.queryName, "main", $rootScope.proName);
                }

            };


            $scope.remove = function(user) {
                alert('Removing participant: ' + user);
                var idx = $scope.participants.indexOf(user);
                if (idx > -1) $scope.participants.splice(idx, 1);
            };

            // load process of this user id and check the role
            $scope.loadProcess = function() {
                newProcessFac.initial.then(function() {
                    $rootScope.myRole = newProcessFac.myRole();
                    $rootScope.myid = newProcessFac.myId();
                    if($rootScope.myRole == 'Lender') {
                        $scope.showLender = true;
                        newProcessFac.getUserProcess()
                            .then(function(data){
                                $rootScope.userCategory = data.data;
                            })
                    } else if ($rootScope.myRole == 'Borrower'){
                        $scope.showBorrower = true;
                        $scope.getPartProcess(); // get process Cateogry of the primary participant or Borrower
                    }


                    /*newProcessFac.getProcess()
                     .then(function(process) {
                     $scope.userProcesses = process.data;
                     // console.log($scope.userProcesses);
                     }) */
                    loadShareProcess();

                });
            };

            // function to load lender process
            $scope.load = function(name){
                $rootScope.tempName = name;
                newProcessFac.loadUserProcess(name)
                    .then(function(data){
                        $scope.userProcess = data.data;
                        //$scope.showTempPanel = true;
                        //console.log($scope.userProcess);
                        if($scope.userProcess.length == 0) {
                            $scope.showTempPanel = false;
                        } else {
                            $scope.showTempPanel = true
                        }
                    })

                // this is call to get primary parts of this lender based process category name and lender id
                if($rootScope.myRole == 'Lender') {
                    $scope.showLender = true;
                    $scope.binfo = null; // reset value
                    $scope.position = null; // reset value
                    $scope.borrowerInfos = null;
                    newProcessFac.getParts(name)
                        .then(function(data){
                            if(data.data[0] != undefined) {
                                var priparts = data.data[0].priParts
                                $rootScope.$broadcast('primaryCustomer', {
                                    temp: { priparts }
                                });


                            }
                        })

                }

            }

            $scope.$on('primaryCustomer', function(event, args) {
                $scope.borrowerInfos = args.temp.priparts;
                //console.log($scope.borrowerInfos);
            })


            $scope.toNormalDate = function(data) {
                //$scope.normalDate = $filter('date')(data, "medium");
                $scope.normalDate = $filter('date')(data, "MM/dd/yyyy");
            },

                $scope.locationChangeFunction = function(data,id,name) {
                    $rootScope.queryID = id;
                    $rootScope.queryName = name;
                    $state.go('processesNews',{ 'name': data.processid});
                }

            // get process category of the primary participant
            $scope.getPartProcess = function(){
                $rootScope.lender = [];
                newProcessFac.loadProcessAgreement().
                then(function(data){
                    $scope.partProcess = data.data;
                   // console.log(data.data);
            })

            }

            $scope.loadActuallProcess = function(data){
                $scope.processing = true;
                if(data.confirmStatus == 'Acknowledged') {
                    newProcessFac.getPartProcess()
                    .then(function(data){
                        $scope.newPartProcess = data.data;
                        $scope.partProcess = null;
                        $scope.processing = false;
                        /*for(var i = 0; i < data.data.length; i++) {
                            $rootScope.lender.push({'owner': data.data[i].userid, 'ownerName': data.data[i].owner});

                        }*/    
                    })
                }
               
            }
                
                
                
            

            // delete process of the lender
            $scope.deleteProcess = function(processid, tempName){
                //console.log(tempName);
                newProcessFac.deleteProcess(processid);
                $scope.load(tempName);
            }

            $scope.loadPartProcess = function(process, lenderId){
                $scope.otherTemp = process;
                $rootScope.processNameShow = process.processName;
                $scope.partProcessName = [];
                newProcessFac.getProsPart(process.processName, lenderId)
                    .then(function(data){
                        $scope.partProcessName = $scope.partProcessName.concat(data.data);
                        //console.log($scope.partProcessName);
                        $scope.otherShowTempPanel = true;

                    });
            }

            $scope.deletePartProcess = function(processid, process){
                newProcessFac.deleteProcess(processid);
                $scope.loadPartProcess(process);
            }


            // if (angular.equals($stateParams.name, 'loanApp')) {
            //   Processes.loanApp.success(function (data) {
            //     form.template = data;
            //     $scope.participants = [];
            //     form.template.participants.forEach(function (email) {
            //       Processes.getUser(email).success(function (data) {
            //         $scope.participants.push(data);
            //       });
            //     });
            //     $scope.description = function () {
            //       return form.template.description;
            //     };
            //     parseForm();
            //   });
            // }

            if (angular.equals($stateParams.name, 'Loan Application')) {
                Processes.loanApp.success(function(data) {
                    //console.log(data);
                    form.template = data;
                    $scope.participants = [];
                    form.template.participants.forEach(function(email) {
                        Processes.getUser(email).success(function(data) {
                            $scope.participants.push(data);
                        });
                    });
                    $scope.description = function() {
                        return form.template.description;
                    };
                    parseForm();
                });
            }

            if (angular.equals($stateParams.name, 'Loan Estimate')) {
                Processes.newLoanApp.success(function(data) {
                    //console.log(data);
                    form.template = data;
                    $scope.participants = [];
                    form.template.participants.forEach(function(email) {
                        Processes.getUser(email).success(function(data) {
                            $scope.participants.push(data);
                        });
                    });
                    $scope.description = function() {
                        return form.template.description;
                    };
                    parseForm();
                });
            }

            // function for new process
            if($stateParams.name && $stateParams.name != 'Loan Estimate' && $stateParams.name != 'Loan Application'){

                // handle the exist process data to call 
                handleExistBackButton();

                $rootScope.processid = $stateParams.name;

                newProcessFac.getOneProcess($rootScope.processid)
                    .then(function(data){
                        $scope.tempProcess = data.data;
                        //console.log(data.data);
                        form.template = data.data;
                        $scope.description = function() {
                            return form.template.description;
                        };

                        $rootScope.processCatName = data.data.category;
                        $rootScope.proName = data.data.name;
                        $rootScope.processOwnerId = data.data.userid;

                        if($rootScope.myRole == 'Lender') {
                            newProcessFac.getParts(data.data.category)
                                .then(function(data){
                                    if(data.data[0] !=  undefined) {
                                        $scope.userParts = data.data[0].priParts;
                                    }
                                    // console.log($scope.userParts);
                                })
                            if($rootScope.queryID) { // have the id of borrower in lender view
                                //console.log($rootScope.queryID);
                                newProcessFac.getBorrowerSaveProcess($rootScope.processid,$rootScope.queryID)
                                    .then(function(data){
                                        //console.log(data.data.feeds[0]);
                                        if(data.data !=  null) {
                                            // console.log(data.data.feeds[0]);
                                            form.model = data.data.feeds[0];
                                            $scope.model = form.model;
                                        }
                                    })

                                   // console.log($rootScope.processOwnerId, $rootScope.queryID);
                                    getFPID($rootScope.processOwnerId, $rootScope.queryID);
                               
                            }
                        }
                        parseForm();


                        if($rootScope.myRole == 'Borrower') {
                            // if the process have the data
                            newProcessFac.getSaveProcess($rootScope.processid)
                                .then(function(data){
                                    //console.log(data.data.feeds[0]);
                                    if(data.data !=  null) {
                                        // console.log(data.data.feeds[0]);
                                        form.model = data.data.feeds[0];
                                        $scope.model = form.model;
                                    }
                                })

                           // console.log($rootScope.processOwnerId + " " + $rootScope.myid);
                            bgetFPID($rootScope.processOwnerId, $rootScope.myid);
                        }
                        // end of process data
                    })

            }

            function handleExistBackButton () {
                $scope.$on('$stateChangeStart', 
                    function(event, toState, toParams, fromState, fromParams){ 
                    // do save process data when user click back or go other tab not work when logout
                    if(fromState.name == 'processesNews' && toState.name != 'login'){
                        console.log("exit the process data page, calling save function");
                        $scope.savePartial("partial");
                    }
     
                }) 
            }

            function bgetFPID(lenderid, bid) {
                newProcessFac.getCategoryFileID(bid)
                    .then(function(data){
                    if(data.data != null) {
                        newProcessFac.bgetFilledFiles(data.data._id,bid, lenderid)
                        .then(function(data){
                            //console.log(data.data);
                            $scope.filledFiles = data.data;
                            //console.log($scope.filledFiles.length);
                        })
                    }
                })
            }

            function getFPID (lenderid, bid) {
                newProcessFac.getCategoryFileID(lenderid)
                    .then(function(data){
                    if(data.data != null) {
                        console.log(data.data);
                        newProcessFac.bgetFilledFiles(data.data._id,lenderid, bid)
                        .then(function(data){
                            $scope.filledFiles = data.data;
                            // console.log($scope.filledFiles.length);
                        })
                    }
                })
            }

            $scope.userDownloadFiles = function(fileid, filename) {
                $http.get('/api/fileDownload/' + fileid, {
                    responseType: 'arraybuffer'
                })
                .success(function(data, status, headers, config) {
                    $scope.filetype = headers('Content-Type');
                    $scope.check = headers('Date');
                    var file = new Blob([data], {
                        type: $scope.filetype
                    });
                    saveAs(file, filename);
                    ngToast.create({
                        className: "success",
                        content: "You have downloaded the file at " + $scope.check,
                        dismissOnClick: true,
                        dismissButton: true
                    });
                });
            }

            // Form parsing function
            function parseForm() {
                // Available fields:
                //  text: Generic text input, available options:
                //    model: data model key (optional)
                //    name: The label associated with the input field
                //    placeholder: Placeholder string
                //    required: Boolean true/false
                //  email: Same as text but validates text for an email address
                //  select: Creates a select element
                //    multiple: Boolean if multiple selections are allowed
                //    options: Array of options:
                //        option: Name and Value that describe the text and data model value for the option
                //  label: Creates an inline label for instructions (only name and type properties)
                var invalid = /[^\w]/gi; // allows upper/lowercase letters, numbers, and underscores (for automatic model names)
                if (form.template == {}) return;
                if (form.template.sections.length <= 0) return;

                if($rootScope.processNameShow) { $scope.title = $rootScope.processNameShow + " " + '\u2192'  + " " + form.template.name; }

                else if($rootScope.tempName) { $scope.title = $rootScope.tempName + " " + '\u2192'  + " " + form.template.name; }

                $scope.desc = form.template.description;
                //console.log(form.template);
                var ownerPass;

                if($rootScope.myRole == 'Lender' || $rootScope.myRole == 'Borrower') {
                    ownerPass = true;
                    $scope.showChat = true;
                } else
                    ownerPass = false;

                // Header and wizard start
                form.parsed = '<wizard current-step-number="currentStepNumber" submit="submit()" new-app="processes.model" desc="desc">';
                

                angular.forEach(form.template.sections, function(section, i) {
                    // Section iterator for not lender or borrower
                    if(!ownerPass) {
                        if(section.participants != undefined){
                            section.participants.every(function(part){
                                // console.log(part.sharesubscribers);
                                // console.log($rootScope.myid);
                                if(part.sharesubscribers == $rootScope.myid){
                                    ownerPass = true; $scope.showChat = true;
                                    //console.log($scope.showChat);
                                    return false;
                                } else  ownerPass = false; return true;
                            })
                        }
                    }
                    //console.log(ownerPass);
                    if (ownerPass) {
                        form.parsed += '<wizard-step animation="zoom" title="' + section.name + '"';
                        //form.parsed += '<span> <button class="btn pull-right btn-info btn-xs" style="font-size:14px; margin-right:28%" ng-click="autoFill(' + i + ')"> Auto Fill </button> </span>';
                        form.parsed += '<span> <button class="btn pull-right btn-success btn-xs" style="font-size:14px; margin-right:3%" ng-click="partialSaveProcess()"> Save Now </button> </span>'
                        form.parsed += '<div class="form-group no-padding" style="margin-top:0;border-bottom:1px solid #eee"><h3 style="margin-top:0;">' + section.name + '</h3></div>';

                        if (section.description != '') form.parsed += '<h5 style="padding-bottom:15px;border-bottom:1px solid #eee">' + section.description + '</h5>'

                        if (section.model == null || section.model == '') section.model = (section.name).replace(invalid, "");
                        form.model[section.model] = {};
                        var modelPtr = form.model[section.model]

                        angular.forEach(section.fields, function(field) {
                            // Field iterator
                            form.parsed += '<div class="form-group" style="overflow:auto">';
                            modelPtr[field.model] = '';

                            if (field.model == null || field.model == '') field.model = (field.name).replace(invalid, "");
                            // Field type selector

                            // console.log("This is field name: " + field.name);

                            if (field.type == "text" || field.type == "email") {
                                // -- Text input field --
                                if(field.name == "SSN" || field.name == "Social Security Number" ) {

                                    //999-99-9999 
                                    // ng-pattern for ssn: /^\d{3}-?\d{2}-?\d{4}$/                                 
                                    form.parsed += '<label class="col-sm-4 control-label">' + field.name + '</label>';
                                    form.parsed += '<div class="col-sm-8"><input type="' + field.type + 
                                        '" class="form-control" ui-mask="999-99-9999" placeholder="' +
                                        field.placeholder + '" ng-model="model.' + section.model + '.' + field.model +
                                        ((field.required) ? '" required>' : '">');
                                    form.parsed += '</div>'; 
                                    
                                } else if(field.name.indexOf("Phone") > -1) {
                                    //Correct format types
                                    // 123-456-7890
                                    // (123) 456-7890
                                    // 123 456 7890
                                    // 123.456.7890
                                    // +91 (123) 456-7890
                                    // ng-pattern for phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
                                    form.parsed += '<label class="col-sm-4 control-label">' + field.name + '</label>';
                                    form.parsed += '<div class="col-sm-8"><input type="' + field.type + 
                                        '" class="form-control" ui-mask="(999) 999-9999" placeholder="' +
                                        field.placeholder + '" ng-model="model.' + section.model + '.' + field.model + ((field.required) ? '" required>' : '">');
                                    form.parsed += '</div>';

                                } else if(field.name.indexOf("Date") > -1 && !(field.name.indexOf("and") > -1)) {
                                    // correct format dd/mm/yyyy
                                    //ng-pattern for date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
                                    form.parsed += '<label class="col-sm-4 control-label">' + field.name + '</label>';
                                    form.parsed += '<div class="col-sm-8"><input type="' + "date" + //forced type to be date when previously set as text
                                        '" class="form-control" is-open="full" datepicker-options="dateOptions" ng-required="true" placeholder="' +
                                        field.placeholder + '" data-ng-model="model.' + section.model + '.' + field.model +
                                        ((field.required) ? '" required>' : '">');
                                    form.parsed += '</div>';  

                                } else {
                                    form.parsed += '<label class="col-sm-4 control-label">' + field.name + '</label>';
                                    form.parsed += '<div class="col-sm-8"><input type="' + field.type + '" class="form-control" placeholder="' +
                                        field.placeholder + '" ng-model="model.' + section.model + '.' + field.model +
                                        ((field.required) ? '" required>' : '">');
                                    form.parsed += '</div>';    
                                }
                                

                                // -- End Text --
                            } else if (field.type == "textarea") {
                                // -- Text area field --
                                form.parsed += '<label class="col-sm-4 control-label">' + field.name + '</label>';
                                form.parsed += '<div class="col-sm-8"><textarea class="form-control" placeholder="' +
                                    field.placeholder + '" ng-model="model.' + section.model + '.' + field.model +
                                    ((field.required) ? '" required>' : '">');
                                form.parsed += '</textarea></div>';
                                // -- End Text Area --
                            } else if (field.type == "select") {
                                // -- Select input field --
                                var explainmodel = '';
                                form.parsed += '<label class="col-sm-7 control-label">' + field.name + '</label>';
                                form.parsed += '<div class="col-sm-5">';
                                form.parsed += '<select class="form-control"' + (field.multiple ? ' multiple ' : ' ') + 'ng-model="model.' +
                                    section.model + '.' + field.model + ((field.required) ? '" required>' : '">');
                                if (field.placeholder != '') form.parsed += '<option value="" selected disabled>' + field.placeholder + '</option>';
                                angular.forEach(field.options, function(option, i) {
                                    if (option.value == null || option.value == '') option.value = option.name.replace(invalid, "");
                                    form.parsed += '<option value="' + option.value + '">' + option.name + '</option>';
                                    if (option.explain) {
                                        explainmodel = option.value;
                                    }
                                });
                                form.parsed += '</select></div>';
                                if (explainmodel != '') {
                                    // Add an explanation field based on select value
                                    modelPtr[field.model + '_other'] = '';
                                    form.parsed += '</div><div ng-if="model.' + section.model + '.' + field.model + '==\'' + explainmodel + '\'"><div class="form-group" style="overflow:auto"><label class="col-sm-4 control-label">' + field.name + '</label>';
                                    form.parsed += '<div class="col-sm-8"><input type="' + field.type +
                                        '" class="form-control" placeholder="Please explain..." ng-model="model.' + section.model + '.' + field.model + '_other' + ((field.required) ? '" required>' : '">');
                                    form.parsed += '</div></div>';
                                }
                                // -- End Select --
                            } else if (field.type == "label") {
                                // -- Label field --
                                form.parsed += '<label class="col-sm-12 control-label">' + field.name + '</label>';
                                // -- End Label --
                            } else if (field.type == "checkbox") {
                                // -- Text input field --
                                form.parsed += '<label class="col-sm-11 col-xs-11 control-label">' + field.name + '</label>';
                                form.parsed += '<div class="col-sm-1 col-xs-1"><input type="checkbox" class="form-control" style="width:17px;" ng-model="model.' + section.model + '.' + field.model + ((field.required) ? '" required>' : '">');
                                form.parsed += '</div>';
                                // -- End Text --
                            } else {
                                form.parsed += '<div class="col-sm-12"><strong>Unrecognized form element</strong></div>';
                            }

                            form.parsed += '</div>';


                        });

                        form.parsed += '<span> <button class="btn pull-right btn-success btn-xs" style="font-size:14px; margin-right:3%" ng-click="partialSaveProcess()"> Save Now </button> </span>';
                        form.parsed += '</wizard-step>';
                    }
                });

                form.parsed += '</wizard>';

                $scope.parsed = form.parsed;
                $scope.model = form.model;
            };


            //=========================================================================
            // functions for date picker
            $scope.todaydate = new Date();
            $scope.today = function() {
                $scope.timeshare = "";
            };
            $scope.today();

            $scope.clear = function() {
                $scope.timeshare = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

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
            //======================================================================            

            $scope.partialSaveProcess = function(){
                $scope.savePartial("partial");
            }

            $scope.autoFill = function(index) {
                //$scope.model = form.model;

            }

            $scope.routingProcess = function(item) {
                $location.path('/process/' + item.name);
            }

            // hard code
            $scope.modernBrowsers = [{
                icon: '<img src="/assets/images/avatars/avatar2.jpg" />',
                name: "Eric",
                email: "esodell@uw.edu",
                ticked: false
            }, {
                icon: '<img src="/assets/images/avatars/avatar3.png"  />',
                name: "Pam",
                email: "Pam@kazume.com",
                ticked: false
            }, {
                icon: '<img src="/assets/images/avatars/avatar6.png"  />',
                name: "Nathan",
                email: "nathan@kazume.com",
                ticked: false
            }, {
                icon: '<img src="/assets/images/avatars/avatar5.png"  />',
                name: "Atma",
                email: "atma@kazume.com",
                ticked: false
            }, {
                icon: '<img src="/assets/images/avatars/avatar11.png" />',
                name: "Robin",
                email: "RobinBeukers@comcast.net",
                ticked: false
            }, {
                icon: '<img src="/assets/images/avatars/avatar8.png"  />',
                name: "Andreas",
                email: "chew.andreas@gmail.com",
                ticked: false
            }, ];


            $scope.processHardCode = [{
                icon: '/assets/images/avatars/avatar2.jpg',
                name: "Eric",
                processName: "Loan pre-qualify and pre-approval",
                status: "active",
                completeRate: 10
            }, {
                icon: '/assets/images/avatars/avatar3.png',
                name: "Pam",
                processName: "Loan Application",
                status: "active",
                completeRate: 25
            }, {
                icon: '/assets/images/avatars/avatar6.png',
                name: "Nathan",
                processName: "Loan Estimate",
                status: "active",
                completeRate: 33
            }, {
                icon: '/assets/images/avatars/avatar5.png',
                name: "Atma",
                processName: "Loan Processing",
                status: "active",
                completeRate: 50
            }, {
                icon: '/assets/images/avatars/avatar11.png',
                name: "Robin",
                processName: "Loan Review and Underwriting",
                status: "active",
                completeRate: 75
            }, {
                icon: '/assets/images/avatars/avatar8.png',
                name: "Andreas",
                processName: "Loan Consummation",
                status: "active",
                completeRate: 25
            }, ];

            $scope.tableHardCode = [{
                name: 'Loan Details',
                nameShare: "Nathan",
                dateFrom: "10/16/15",
                dateTo: "10/30/15"
            }, {
                name: 'Loan Terms',
                nameShare: "Nathan",
                dateFrom: "10/16/15",
                dateTo: "10/30/15"
            }];



            function loadShareProcess() {
                newProcessFac.getShareProcess()
                    .then(function(process){
                        $scope.shareProcesses = process.data;
                        // console.log($scope.shareProcesses);
                    })
            }

            $scope.deleteShareProcess = function(processid){
                newProcessFac.deleteProcess(processid);
                loadShareProcess();
            }

            $scope.sendProcess = function(tempName){
               // console.log(tempName);
                $scope.open = function(size) {
                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/app/views/pages/processes/partial/sendProcess.html',
                        controller: 'processFuncCtrl',
                        size: size,
                        backdrop : 'static',
                        resolve: {
                            processNamePass: function() {
                                //console.log($scope.participants);
                                return tempName;
                            },
                        }
                    });
                };

                $scope.open();
            }

            /* $scope.$watch('model', function() {
             console.log($scope.model);
             });*/

            /*$scope.loadProcessCategory = function(name) {
             newProcessFac.loadUserProcess(name)
             .then(function(data){
             $scope.userProcess = data.data;
             console.log($scope.userProcess);
             })
             }*/




            $scope.pdfFileName = [{
                'name': 'Step by Step Mortgage Guide'
            }];
            $scope.Mortgage = [{
                'name': 'Mortgage Process'
            }, {
                'name': 'Other'
            }];
            /*$scope.model = {};*/
            /*$scope.model.temp = {
             'name': 'Mortgage Process'
             };*/

            $scope.funtionTemp = function(data) {
                if (data == 'Mortgage Process') $scope.showTempPanel = true;
                else {
                    $scope.showTempPanel = false;
                    return;
                }
            };

            //path to pdf file
            if (angular.equals($stateParams.file, 'View Loan Application PDF form')) {
                $scope.pdfUrl = '/assets/pdf/Mortgage-app-Form-1003.pdf';
                $scope.pdffilename = 'Loan Application PDF form';
            }

            if (angular.equals($stateParams.file, 'Step by Step Mortgage Guide')) {
                $scope.pdfUrl = '/assets/pdf/Step_by_Step_Mortgage_Guide_English.pdf';
                $scope.pdffilename = 'Step by Step Mortgage Guide';
            }

            if (angular.equals($stateParams.file, 'View Loan Estimate PDF form')) {
                $scope.pdfUrl = '/assets/pdf/LoanEstimate.pdf';
                $scope.pdffilename = 'Loan Estimate PDF form';
            }

            if (angular.equals($stateParams.viewFile, 'Loan Application PDF form')) {
                $scope.pdfUrl = '/assets/pdf/fillLoanApplication.pdf';
                $scope.pdffilename = 'Loan Application PDF Auto Form';
            }

            if (angular.equals($stateParams.viewFile, 'Loan Estimate PDF form')) {
                $scope.pdfUrl = '/assets/pdf/fillLoanEstimate.pdf';
                $scope.pdffilename = 'Loan Estimate PDF Auto Form';
            }

        }
    ])

    .directive('compile', ['$compile', function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }])

    .controller('processFuncCtrl', ['Category', '$scope', 'newProcessFac', '$rootScope',  'processNamePass', '$uibModalInstance', 'AgreementCategory', 'ngToast', 'User', 'Participant', function(Category,  $scope, newProcessFac, $rootScope, processNamePass,$uibModalInstance,AgreementCategory,ngToast, User,Participant) {
        //function for sending participant to become primary participants
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.optionsData = [{
            'option': 'Loan Application'
        }, {
            'option': 'Insurance'
        }, {
            'option': 'Appraisal'
        }];

        $scope.selectedOption = {};
        $scope.selectedOption.select = {
            'option': 'Select email template'
        };
        $scope.sendEmail = {
            content: "This is the content inside.",
            subject: 'Subject: '
        };
        $scope.select = function(option) {
            if(option == 'Loan Application') {
                var string = 'Hello < >' +
                    '\n\nThis is an invitation for a Loan application process with us. Please click the below link to proceed.' +
                    // '\n\nYour personal information:' +
                    '\nPlease be assured that your personal information will only be used for the purpose of this loan application. Your information will be accessed by the loan processors within this office and no one else.\n\nTThank you for your business.';
            } else if (option == 'Appraisal') {
                var string = 'Hello < >' +
                    '\n\nThis is an invitation for an Appraisal process . Please click the below link to proceed.' +
                    '\n\nPlease be assured that your personal information will only be used for the purpose of this appraisal. Your information will be accessed by the  processors within this office and no one else.\n\nThank you for your business.';
            } else if (option == 'Insurance') {
                var string = 'Hello < >' +
                    '\n\nThis is an invitation for an Insurance process . Please click the below link to proceed.' +
                    '\n\nPlease be assured that your personal information will only be used for the purpose of this Insurance. Your information will be accessed by the  processors within this office and no one else.\n\nThank you for your business.';
            }

            $scope.sendEmail = {
                content: string,
                subject: 'Subject: '
            };
        }


        $scope.processNamePass = processNamePass;
        $scope.addPartToProcess = function(parts, processCatName, emailData){
           // console.log(parts);
           Category.agreementService(parts, processCatName, $rootScope.userCategory._id);
           newProcessFac.addPartToPro(parts, processCatName);
            for(var i = 0; i < parts.length; i++) {
                angular.extend(parts[i],emailData);
                $rootScope.temp = parts[i];

                if(!$rootScope.temp.sharesubscribers) {
                     Category.checkIfSentCode(parts[i].email)
                    .then(function(data){
                    if(data.data.sent == false) {
                        Category.newCode("Borrower").success(function (data) {
                        $scope.code = {code:data.code};
                        angular.extend($rootScope.temp, $scope.code);
                        AgreementCategory.sendingMailOut($rootScope.temp)
                        .success(function(value){
                            if(value) {
                                ngToast.create({className: value.type, content: value.message, dismissOnClick: true,
                                dismissButton: true});
                            }
                        })
                        });
                    }
                    })
                } else { // this is already an user no need to send code
                    // just send email out
                    AgreementCategory.sendingMailOut($rootScope.temp)
                        .success(function(value){
                        if(value) {
                            ngToast.create({className: value.type, content: value.message, dismissOnClick: true,
                            dismissButton: true});
                        }
                    })
                }
               
                
                
            }

            $uibModalInstance.dismiss('cancel');
        }

        $scope.loadParticipant = function() {

            /*User.getMe().success( function (data) {
                var myId = data[0]._id;
                // console.log("This should be userid " + vm.myId);
      
                Participant.getCategories(myId).success( function (catData) {
                $scope.sorted = catData;
                console.log("this is sorted");
                console.log($scope.sorted);
             });
            });*/



            Category.initial().then(function() {
                $rootScope.userData = Category.getMyId();
                Category.getParticipants()
                    .then(function(parts) {
                        $scope.participants = parts.data[0];
                       //  console.log($scope.participants);
                        $scope.allParticipants = [];

                        // modify $scope.allParticipants for display
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
                    });
            });
        };
        $scope.loadParticipant();

        // end of new sending functions
    }])

    .controller('wizardCtrl', ['Category', 'Participant', '$scope', 'ngToast',  '$rootScope', '$location', '$stateParams', 'newProcessFac', function(Category, Participant, $scope, ngToast, $rootScope, $location,$stateParams,newProcessFac) {

        // functions to edit the process data
        if (!angular.equals($stateParams.page, 'editProcess')) {
            newProcessFac.getOneProcess($stateParams.page)
             .then(function(data){
                $scope.editprocess = data.data;
                console.log($scope.editprocess);
             })
        }

        $scope.editProcessForm = function(){
            newProcessFac.createProcess($scope.editprocess)
                .success(function(data) {
                    infoOut(data.type, data.message);
                }).finally(function() {
                $location.path("/processes");
            })
        }

        $scope.editSection = function(index) {
            //console.log(index);
            $scope.showAddSection = false;
            $scope.showEditSection = true;
            $scope.idx = index;
        }

        $scope.deleteEditSection = function(index) {
            $scope.editprocess.sections.splice(index, 1);
            //console.log($scope.editprocess);
        }

        $scope.showSectionElement = function(index) {
            $scope.showElements = true;
            $scope.hideOption = false;
            $scope.showAddElement = false;
            $rootScope.idxS = index;
            $scope.agrVar = { maxSize: 10, currentPage: 1, numPerPage: 5};
            $scope.filteredAgr = [];
            $scope.totalItems = $scope.editprocess.sections[index].fields.length;
            //console.log($scope.totalItems);

            $scope.numPages = function () {
                return Math.ceil($scope.totalItems / $scope.agrVar.numPerPage);
            };

            $scope.changePage = function () {
                var begin = (($scope.agrVar.currentPage - 1) * $scope.agrVar.numPerPage)
                    , end = begin + $scope.agrVar.numPerPage;
                    $scope.filteredAgr = $scope.editprocess.sections[index].fields.slice(begin, end);
                   // console.log($scope.filteredAgr);
                };
            $scope.changePage();
        }

        $scope.editSectionElements = function(index) {
            
            $scope.idxE = getIndex(index);
            //console.log("root section " + $rootScope.idxS);
            //console.log("element " + $scope.idxE);
            $scope.showEditSectionElement = true;
            $scope.showAddElement = false;
        }

        $scope.deleteElementSection = function(index) {
            var idx = getIndex(index);     
            $scope.editprocess.sections[$rootScope.idxS].fields.splice(idx, 1);
            $scope.showSectionElement($rootScope.idxS); // re call the display of pagination
        }

        function getIndex(index) {
            if($scope.agrVar.currentPage > 1) {
                return ((($scope.agrVar.currentPage - 1) * $scope.agrVar.numPerPage) + index);
            } else if ($scope.agrVar.currentPage == 1) {
                return index;
            }
        }
        $scope.addSectionInEdit = function() {
            $scope.showAddSection = true;
            $scope.showEditSection = false;
        }
        
        $scope.saveSectionInEdit = function(data){
            var newSection = {};
                newSection['name'] = data.name;
                newSection['description'] = data.description;
                newSection['participants'] = [];
                newSection['fields'] = [];
            var runner = 0;
            var ableToAdd = false;
            $scope.editprocess.sections.every(function(section) {
                if (section.name.toUpperCase() == newSection.name.toUpperCase()) {
                    infoOut("info", "Can't add same to exsting section");
                    return false;
                }

                runner++;
                if (runner == ($scope.editprocess.sections.length)) {
                    ableToAdd = true;
                }
                    return true;
                });
            if (ableToAdd) {
                $scope.editprocess.sections.push(newSection);
                infoOut("success", "Successfully add the section");
                        //console.log($scope.process);
            }
           // console.log($scope.editprocess);
        }
                
        $scope.addElementInEdit = function(index) {
            $scope.idxToAdd = index;
            $scope.showAddElement = true;
            $scope.showEditSectionElement = false;
            $scope.showElements = false;
            $scope.hideOption = true;
        }

        $scope.saveElementInEdit = function(element, idx){
            var runner = 0;
            var ableToAdd = false;
            if (element.type == "single select" || element.type == "multiple select") {
                if(element.type == 'single select') {
                    element.multiple = false;
                } else {
                    element.multiple = true;
                }
                element.type = "select";
                if(!$scope.optionFinal) {
                    infoOut("info", "Please add options, try again");
                    return;
                }
                element.options = $scope.optionFinal;
                
            };

           // console.log(element);
            $scope.editprocess.sections[idx].fields.push(element);
        
            ngToast.create({
                className: "success",
                content: "Add elements: " + element.name + " .Type: " + element.type + " .For section: " + $scope.editprocess.sections[idx].name,
                dismissOnClick: true,
                dismissButton: true
            });
                $scope.dataElements = {};
                $scope.optionModify = {};
                $scope.showAddElement = false;
               // console.log($scope.editprocess);
        }

        $scope.addOptionInEdit = function (options){

             if (!options) {
                return;
            };
            $scope.optionModify = options.toAdd.split(' ');
            $scope.optionFinal = [];

            for (var i = 0; i < $scope.optionModify.length; i++) {
                //console.log($scope.optionModify[i]);
                $scope.temp = {};
                $scope.temp['name'] = $scope.optionModify[i];
                $scope.optionFinal.push($scope.temp);
            }
            $scope.showToSave = true;
            infoOut("success", "Options saved");
        }

        // end of new functions

        // process category picked option
        $scope.processOptions = [{
            name: 'Mortgage'
        }, {
            name: 'Reverse Mortgage'
        },{
            name: 'Loan Application'
        },{
            name: 'Financial'
        },{
            name: 'Business'
        },{
            name: 'Life Insurance'
        }];

        $scope.process = {};
        $scope.dataElements = {};
        $scope.secPart = {};
        $scope.process.sections = [];
        $scope.options = {};


        $scope.elementRequire = ['true', 'false'];
        $scope.elementType = [
            'text', 'textarea', 'label', 'checkbox', 'single select', 'multiple select'
        ];

        $scope.otherType = [
            'text', 'textarea', 'label', 'checkbox', 'select'
        ];

        $scope.processForm = function() {
            //alert('information completed');
            //console.log($scope.process);
            newProcessFac.createProcess($scope.process)
                .success(function(data) {
                    infoOut(data.type, data.message);
                }).finally(function() {
                $location.path("/processes");
            })
        };

        $scope.endView = function() {
            $scope.showPreview = false;
        }

        $scope.deleteElement = function(currentProcess, index, section) {
            /*console.log(currentProcess);
             console.log(index);
             console.log(section);*/
            for (var i = 0; i < currentProcess.sections.length; i++) {
                if (currentProcess.sections[i].name == section.name) {
                    currentProcess.sections[i].fields.splice(index, 1);
                    infoOut("success", "Element deleted");
                }
            }
            $scope.processSec = currentProcess;
        }

        $scope.showElement = function(currentProcess) {
            if (!currentProcess) {
                infoOut("danger", "Please don't skip step");
                return;
            }
            //console.log(currentProcess);
            $scope.showPreview = true;
        }

        $scope.saveElement = function(element, currentProcess, optionData) {
            if (!currentProcess) {
                infoOut("danger", "Please don't skip step");
                return;
            }

            if (element.type == "single select") {
                element.multiple = false;
                addOptions();
            }

            if (element.type == "multiple select") {
                element.multiple = true;
                addOptions();
            }

            function addOptions() {
                element.options = optionData;
                //element.options.push(optionData);
            }

            var runner = 0;
            for (var i = 0; i < currentProcess.sections.length; i++) {
                if (currentProcess.sections[i].elements) { // the sections need to add
                    if (element.type == "single select" || element.type == "multiple select") {
                        element.type = "select";
                    };
                    currentProcess.sections[i].fields.push(element);
                    ngToast.create({
                        className: "success",
                        content: "Add elements: " + element.name + " .Type: " + element.type + " .For section: " + currentProcess.sections[i].name,
                        dismissOnClick: true,
                        dismissButton: true
                    });
                    $scope.dataElements = {};
                    $scope.optionModify = {};
                } else {
                    runner++;
                    if (runner == currentProcess.sections.length) {
                        infoOut("info", "Please select section to add elements");
                    }
                }
            }
            //console.log(currentProcess);
        }

        $scope.addOption = function(options) {
            if (!options) {
                return;
            };
            $scope.optionModify = options.toAdd.split(' ');
            $scope.optionFinal = [];

            for (var i = 0; i < $scope.optionModify.length; i++) {
                //console.log($scope.optionModify[i]);
                $scope.temp = {};
                $scope.temp['name'] = $scope.optionModify[i];
                $scope.optionFinal.push($scope.temp);
            }
            infoOut("success", "Options saved");
        }

        $scope.deleteSection = function(currentProcess) {

            if (!currentProcess) {
                infoOut("danger", "Please don't skip step");
                return;
            } else {
                var runner = 0;
                for (var i = 0; i < currentProcess.sections.length; i++) {
                    if (currentProcess.sections[i].modify) {
                        ngToast.create({
                            className: "success",
                            content: "Successfully delete " + currentProcess.sections[i].name,
                            dismissOnClick: true,
                            dismissButton: true
                        });
                        currentProcess.sections.splice(i, 1);
                    } else {
                        runner++;
                        if (runner == currentProcess.sections.length) {
                            infoOut("info", "Please select section to delete");
                        }
                    }
                }
                $scope.processSec = currentProcess;
            }

        }

        $scope.saveParticipant = function(parts, currentProcess) {
            //console.log(currentProcess);
            //console.log(participants);
            if (!currentProcess) {
                infoOut("danger", "Please don't skip step");
                return;
            } else if (currentProcess.sections.length < 1) {
                infoOut("info", "Please add section first");
                return;
            } else {
                var runner = 0;
                for (var i = 0; i < currentProcess.sections.length; i++) {
                    if (currentProcess.sections[i].modify) { // the sections need to add
                        if (currentProcess.sections[i].participants.length > 0) {
                            currentProcess.sections[i].participants.length = 0;
                        }
                        for (var j = 0; j < parts.length; j++) {
                            currentProcess.sections[i].participants.push(parts[j]);
                        };
                        ngToast.create({
                            className: "success",
                            content: "Update participant list for " + currentProcess.sections[i].name,
                            dismissOnClick: true,
                            dismissButton: true
                        });
                    } else {
                        runner++;
                        if (runner == currentProcess.sections.length) {
                            infoOut("info", "Please Select section to add/modify participants");
                        }
                    }
                }

                //console.log(currentProcess);
            }
        }

        function infoOut(type, message) {
            ngToast.create({
                className: type,
                content: message,
                dismissOnClick: true,
                dismissButton: true
            });
        }

        $scope.saveSection = function(processData) {
            if (!processData.processName) {
                infoOut("danger", "Please don't skip step");
                return;
            } else {
                var section = {};
                section['name'] = processData.sectionName;
                section['description'] = processData.sectionDescription;
                section['participants'] = [];
                section['fields'] = [];
                if ($scope.process.sections.length == 0) {
                    $scope.process.sections.push(section);
                    infoOut("success", "Successfully add the section");
                    //console.log($scope.process);
                } else {
                    var runner = 0;
                    var ableToAdd = false;
                    $scope.process.sections.every(function(section) {
                        if (section.name.toUpperCase() == processData.sectionName.toUpperCase()) {
                            infoOut("info", "Can't add same to exsting section");
                            return false;
                        }

                        runner++;
                        if (runner == ($scope.process.sections.length)) {
                            ableToAdd = true;
                        }
                        return true;
                    });
                    if (ableToAdd) {
                        $scope.process.sections.push(section);
                        infoOut("success", "Successfully add the section");
                        //console.log($scope.process);
                    }
                }

                $scope.processSec = $scope.process;
            }
        }

        $scope.loadParticipant = function() {
            Category.initial().then(function() {
                $rootScope.userData = Category.getMyId();
                Category.getParticipants()
                    .then(function(parts) {
                        $scope.participants = parts.data[0];
                        // console.log($scope.participants);
                        $scope.allParticipants = [];

                        // modify $scope.allParticipants for display
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
                    });
            });
        };
        $scope.loadParticipant();
    }])

    .directive('participantPickup', function() {
        return {
            controller: 'wizardCtrl'
        };
    })

    .controller('chartJsDoughnutCtrl', function($scope) {

        // Chart.js Data
        var random = Math.floor(Math.random() * 100) + 1;
        $scope.chartprocessdata = [{
            value: random,
            color: "#228b22",
            highlight: "#1ABC9C",
            label: ""
        }, {
            value: 100 - random,
            color: "#dcdcdc",
            highlight: "#1ABC9C",
            label: ""
        }];

        // Chart.js Options
        $scope.options = {

            showTooltips: true,

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps: 100,

            //String - Animation easing effect
            animationEasing: 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale: true,

            //tooltipTemplate: "<%= value %>",
            //String - A legend template
            legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };

    


    });

