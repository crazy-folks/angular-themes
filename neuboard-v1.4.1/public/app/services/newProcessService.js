angular.module('newProcessService', [])

    .service('newProcessFac',['$rootScope', '$http', 'User', '$q', 'ngToast', function($rootScope, $http, User,$q,ngToast) {
        var initial1 = User.getMe().success(function (data) {
            $rootScope.userData = data[0];
            // console.log($rootScope.userData);
        });

        var getProcesses = function() {
            var deferred = $q.defer();
            $http.get('/api/processCreate/' + $rootScope.userData._id + '/' + $rootScope.userData.name)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var getAProcess = function(processid) {
            var deferred = $q.defer();
            $http.get('/api/getAProcess/' + processid)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var getShareProcess = function() {
            var deferred = $q.defer();
            $http.get('/api/modifyProcess/' + $rootScope.userData._id)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var deleteProcess = function(processid){
            $http.delete('/api/modifyProcess/' + processid)
                .success(function (data, status, headers, config) {
                    inform(data.type,data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        inform(data.type,data.message);
                    }
                });
        }

        function inform(type,message){
            ngToast.create({ className: type, content: message});
        };

        var userProcess = function(){
            var deferred = $q.defer();
            $http.get('/api/processCategory/' + $rootScope.userData._id)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var load = function(category){
            var deferred = $q.defer();
            $http.get('/api/processCreate/' + $rootScope.userData._id + '/' + category)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var getParts = function(categoryName){
            var deferred = $q.defer();
            $http.get('/api/processParticipant/users/' + $rootScope.userData._id + '/' + categoryName)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var addPartToProcess = function (part, name){
            $http.post('/api/partProcess/' + $rootScope.userData._id + '/' + name, part)
                .success(function (data, status, headers, config) {
                    inform(data.type,data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        inform(data.type,data.message);
                    }
                });
        }

        var getPartProcess = function() {
            var deferred = $q.defer();
            $http.get('/api/partCategory/' + $rootScope.userData._id)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var getProcessesDetail = function(processName, lender) {
            var deferred = $q.defer();
            $http.get('/api/processCreate/' + lender + '/' + processName)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var saveProcess = function(data, processid, category, process, owner, state, processname){
            var temp = [];
            temp.push(process);
            $http.post('/api/saveProcess/' + $rootScope.userData._id + '/' + processid + '/' + category + '/' + temp + '/' + owner + '/' + state + '/' + $rootScope.userData.name + '/' + processname, data)
                .success(function (data, status, headers, config) {
                    inform(data.type,data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        inform(data.type,data.message);
                    }
                });
        }

        var getSaveProcess = function(processid){
            var deferred = $q.defer();
            $http.get('/api/getSaveProcess/' + $rootScope.userData._id + '/' + processid)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var getBorrowerSaveProcess = function(processid, borrowerid) {
            var deferred = $q.defer();
            $http.get('/api/getSaveProcess/' + borrowerid  + '/' + processid)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        var lenderSaveData = function (data,processid,processCatName,proName,lenderId,borrowerId, borrowerName, state, processName) {
            var temp = [];
            temp.push(proName);
            $http.post('/api/saveProcess/' + borrowerId + '/' + processid + '/' + processCatName + '/' + temp + '/' + lenderId + '/' + state + '/' + borrowerName + '/' + processname, data)
                .success(function (data, status, headers, config) {
                    inform(data.type,data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        inform(data.type,data.message);
                    }
                });
        }

        var getCategoryFileID = function(id) {
            var deferred = $q.defer();
            $http.get('/api/getCategoryFileID/' + id)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

       /* var getFilledFiles = function (processid, bid){
            var deferred = $q.defer();
            $http.get('/api/getFilledFiles/' + processid + '/' + bid)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        }*/

        var bgetFilledFiles = function (processid, lenderid, bid) {
           // console.log(processid + " " + lenderid + " " + bid);
            var deferred = $q.defer();
            $http.get('/api/bgetFilledFiles/' + processid + '/' + lenderid + '/' + bid)
                .then(function (data) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        } 

        var addUserIdToProcess = function(user) {
            $http.post('/api/addUserIdToProcess', user)
                .success(function (data, status, headers, config) {
                    //inform(data.type,data.message);
                   // console.log(data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        console.log(data.message);
                       // inform(data.type,data.message);
                    }
            });
        }

        var loadProcessAgreement = function() {
            var deferred = $q.defer();
            $http.get('/api/loadMyAllSharedProcess/' + $rootScope.userData.email)
            .then(function (data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }

        var addUserIdToPart = function (user) {
            $http.post('/api/addUserIdToPart', user)
                .success(function (data, status, headers, config) {
                    //inform(data.type,data.message);
                    console.log(data.message);
                })
                .error(function (data, status, headers, config) {
                    if (data) {
                        console.log(data.message);
                       // inform(data.type,data.message);
                    }
            });
        }


        return {
            initial: $q.all({ init1: initial1 }),
            createProcess: function (processData) {
                return $http.post('/api/processCreate/' + $rootScope.userData._id + '/' + $rootScope.userData.name + '/', processData);
            },
            getProcess:function(){ return getProcesses();},
            getOneProcess:function(id){return getAProcess(id);},
            getShareProcess:function() {return getShareProcess();},
            myRole:function() {return $rootScope.userData.userRoles[0]},
            deleteProcess:function(id) {return deleteProcess(id);},
            getUserProcess:function() {return userProcess();},
            loadUserProcess:function(name) {return load(name);},
            getParts:function(categoryName) {return getParts(categoryName);},
            addPartToPro:function(part,categoryName) {return addPartToProcess(part,categoryName);},
            getPartProcess:function() {return getPartProcess(); },
            getProsPart:function(processName, lender) {return getProcessesDetail(processName, lender);},
            myId:function(){return $rootScope.userData._id},
            saveProcess:function(data, id, category, process, owner, state, processname) {return saveProcess(data, id, category, process, owner, state,processname)},
            getSaveProcess:function(id) {return getSaveProcess(id)},
            getBorrowerSaveProcess:function(processid, borrowerid) {return getBorrowerSaveProcess(processid, borrowerid)},
            lenderSaveData:function(data,processid,processCatName,proName,lenderId,borrowerId, borrowerName, state, processname) { return lenderSaveData(data,processid,processCatName,proName,lenderId,borrowerId,borrowerName, state, processname) },
            getCategoryFileID:function(id) {return getCategoryFileID (id)},
            getFilledFiles:function(processid, bid) {return getFilledFiles(processid,bid)},
            bgetFilledFiles:function(processid,lenderid,bid) { return bgetFilledFiles (processid,lenderid,bid)},
            addUserIdToProcess:function(user) {return addUserIdToProcess(user)},
            loadProcessAgreement:function(){return loadProcessAgreement()},
            addUserIdToPart:function(user){return addUserIdToPart(user)}
        };

    }]);