angular.module('vaultService', ['ngFileUpload'])

  .service('Category', ['$rootScope', '$http', 'User', '$q', 'ngToast', 'Upload', function ($rootScope, $http, User, $q, ngToast, Upload) {
    var initial1 = function () {
      User.getMe().success(function (data) {
        $rootScope.userData = data[0];
      });

      return $http.get("/api/my_id");
    };


    var categories = function () {
      var deferred = $q.defer();
      $http.get('/api/KazGetCategories/' + $rootScope.userData._id)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var addCategory = function (category, callback) {
      category.type = "1";  // type 1 for vault Categories
      category.subscriberid = $rootScope.userData._id;
      $http.post('/api/KazGetCategories/', category)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var update = function (id, data) {
      $http.put('/api/KazGetCategories/' + id, data)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var deleteMain = function (id) {
      $http.delete('/api/KazGetCategories/' + id)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    function successCall(data, callback) {
      if (data) {
        inform(data.type, data.message);
      }
      if (callback) callback();
    }

    function inform(type, message) {
      ngToast.create({className: type, content: message});
    }

    var addSub = function (id, data) {
      $http.post('/api/KazSubCategory/' + id, data)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var updateSubCategory = function (id, data) {
      $http.put('/api/KazSubCategory/' + id, data)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var deleteSubCategory = function (id, data) {
      $http.delete('/api/KazSubCategory/' + id + "/" + data.id + "/" + data.name)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var getFileCat = function () {
      var deferred = $q.defer();
      $http.get('/api/fCategory/' + $rootScope.userData._id + '/' + $rootScope.userData.name)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var addFileCat = function (fileInfo) {
      $http.post('/api/fCategory/' + $rootScope.userData._id + '/' + $rootScope.userData.name, fileInfo)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var deleteFCat = function (fCat) {
      $http.delete('/api/categoryFunction/' + fCat._id)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var updateFCat = function (fileInfo) {
      $http.put('/api/categoryFunction/' + fileInfo._id, fileInfo)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    };

    var myShareFiles = function () {
      var deferred = $q.defer();
      $http.get('/api/sharedFiles/' + $rootScope.userData._id)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var uploadFile = function (files, fileCat, successCallback) {
      //console.log(files);
      if (!files) return;
      if (!fileCat) return;
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {

          var file = files[i];
          if (!file.$error) {
            Upload.upload({
              url: '/api/files',
              fields: {
                'owner': $rootScope.userData._id,
                'categoryId': fileCat._id
              },
              headers: {
                'Content-Type': file.type
              },
              file: file
            }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              /*console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
               if(progressPercentage == 100) {
               ngToast.create({ className: 'info', content: 'Upload progress: ' + progressPercentage + '%' });
               }   */
            }).success(function (data, status, headers, config) {
              if (status == 200) {
                if (config && data) console.log('File: ' + config.file.name + 'uploaded. Response: ' + data);
                if (alert) {
                  ngToast.create({className: 'success', content: data});
                }
                if (successCallback) successCallback();
              }
            }).error(function (data, status, headers, config) {
              if (status == 409) {
                if (data) {
                  console.log(data);
                  if (alert) {
                    ngToast.create({className: 'danger', content: data});
                  }
                }
              } else {
                console.log('Unexpected error: ' + status);
                if (alert) {
                  ngToast.create({className: 'danger', content: 'Unexpected error uploading file: ' + status});
                }
              }
            });
          }
        }
      }
    };

    var downloadFile = function (filename, userfile) {
      $http.get('/api/files/' + $rootScope.userData._id + '/' + userfile.filename, {responseType: 'arraybuffer'})
        .success(function (data, status, headers, config) {
          $rootScope.filetype = headers('Content-Type');
          $rootScope.check = headers('Date');
          var file = new Blob([data], {type: $rootScope.filetype});
          saveAs(file, filename);
          ngToast.create({
            className: "success", content: "You have downloaded the file at" + $rootScope.check, dismissOnClick: true,
            dismissButton: true
          });
        });
    };

    var loadContent = function () {
      var deferred = $q.defer();
      $http.get('/api/Argeements/' + $rootScope.userData.email)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var loadMyContent = function () {
      var deferred = $q.defer();
      $http.get('/api/loadMyArgeements/' + $rootScope.userData._id)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var myUser = function () {
      return $rootScope.userData;
    };

    var participants = function () {
      var deferred = $q.defer();
      $http.get('/api/participants/' + $rootScope.userData._id)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var removeFiles = function (fileCatId, file, successCallback) {
      if (!file) return;
      $http.delete('/api/files/' + $rootScope.userData._id + '/' + file.filename + '/' + fileCatId)
        .success(function (data, status, headers, config) {
          if (data) {
            ngToast.create({className: data.type, content: data.message});
          }
          if (successCallback) successCallback();
        })
        .error(function (data, status, headers, config) {
          if (data) {
            ngToast.create({className: data.type, content: data.message});
          }
        });
    };

    var loadMySharedData = function () {
      var deferred = $q.defer();
      $http.get('/api/loadMySharedData/' + $rootScope.userData._id)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var loadMyAllShared = function() {
      var deferred = $q.defer();
      $http.get('/api/loadMyAllShared/' + $rootScope.userData.email)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    };

    var requestValue = function(data){
      var object = {};
      object['value'] = data.vaultvalues[data.vaultvalues.length -1].value;
      $http.post('/api/userRequestValue/' + $rootScope.userData.email, object)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    }

    var agreementService = function(partinfo, processCatName, catID){
        //console.log($rootScope.userData);
        $http.post('/api/agreementService/' + processCatName + '/' + catID + '/' + $rootScope.userData._id + '/' + $rootScope.userData.name, partinfo)
        .success(function (data, status, headers, config) {
          inform(data.type, data.message);
        })
        .error(function (data, status, headers, config) {
          if (data) {
            inform(data.type, data.message);
          }
        });
    } 

    var newCode = function (data){
      return $http.post("/api/tempcodes", {role: data});
    }

    var checkIfSentCode = function(email){
      var deferred = $q.defer();
      $http.get('/api/getLenderCodeCheck/' + $rootScope.userData._id + '/' + email)
        .then(function (data) {
          deferred.resolve(data);
        });
      return deferred.promise;
    }

    return {
      initial: function () {
        return initial1();
      },
      getCategories: function () {
        return categories();
      },
      updateCategory: function (id, data) {
        return update(id, data);
      },
      deleteCategory: function (id) {
        return deleteMain(id);
      },
      createCategory: function (data) {
        return addCategory(data);
      },
      createSub: function (id, data) {
        return addSub(id, data);
      },
      updateSub: function (id, data) {
        return updateSubCategory(id, data);
      },
      deleteSub: function (id, data) {
        return deleteSubCategory(id, data);
      },
      getFileCategory: function () {
        return getFileCat();
      },
      addFileCategory: function (data) {
        return addFileCat(data);
      },
      deleteFCat: function (fileInfo) {
        return deleteFCat(fileInfo);
      },
      updateFileCategory: function (fileInfo) {
        return updateFCat(fileInfo);
      },
      findSharedFiles: function () {
        return myShareFiles();
      },
      uploadFileCategory: function (files, fileCategory, getFiles) {
        return uploadFile(files, fileCategory, getFiles);
      },
      userFileDownload: function (filename, userfile) {
        return downloadFile(filename, userfile);
      },
      loadContent: function () {
        return loadContent();
      },
      loadMyContent: function () {
        return loadMyContent();
      },
      getMyId: function () {
        return myUser();
      },
      getParticipants: function () {
        return participants();
      },
      removeFiles: function (file, successCallback) {
        return removeFiles(file, successCallback)
      },
      loadMySharedData:function() {
        return loadMySharedData();
      },
      loadMyAllShared:function() {
        return loadMyAllShared();
      },
      requestValue:function(data) {
        return requestValue(data);
      }, 
      agreementService:function(partinfo, processCatName, catID) {
        return agreementService(partinfo, processCatName, catID);
      },
      newCode:function(role) {
        return newCode(role);
      },
      checkIfSentCode:function(email){
        return checkIfSentCode(email);
      }
    };

  }]);

