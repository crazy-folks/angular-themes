angular.module('fileService', ['ngFileUpload', 'ngMd5', 'ngToast'])
.service('Files', ['$q', '$http', 'User', 'Upload', 'ngToast', function ($q, $http, User, Upload, ngToast) {
  var user;
  var initial1 = User.getMe().success(function (data) {
    user = data[0];
  });

  return {
    initial: $q.all({ init1: initial1 }),

    uploadFiles: function (files, successCallback, id) {
      if (!files) return;
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            Upload.upload({
              url: '/api/files',
              fields: {
                'owner': (id == null) ? user._id : id
              },
              headers: {
                'Content-Type': file.type
              },
              file: file
            }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
              ngToast.create({ className: 'info', content: 'Upload progress: ' + progressPercentage + '%' });
            }).success(function (data, status, headers, config) {
              if (status == 200) {
                if (config && data) console.log('File: ' + config.file.name + 'uploaded. Response: ' + data);
                ngToast.create({ className: 'success', content: data });
                if (successCallback) successCallback();
              }
            }).error(function (data, status, headers, config) {
              if (status == 409) {
                if (data) {
                  console.log(data);
                  if (alert) {
                    ngToast.create({ className: 'danger', content: data });
                  }
                }
              } else {
                console.log('Unexpected error: ' + status);
                if (alert) {
                  ngToast.create({ className: 'danger', content: 'Unexpected error uploading file: ' + status });
                }
              }
            });
          }
        }
      }
    },

    remove: function (file, successCallback, id) {
      if (!file) return;
      $http.delete('/api/files/' + (id || user._id) + '/' + file.filename)
      .success(function (data, status, headers, config) {
        if (data) {
          ngToast.create({ className: data.type, content: data.msg });
        }
        if (successCallback) successCallback();
      })
      .error(function (data, status, headers, config) {
        if (data) {
          ngToast.create({ className: data.type, content: data.msg });
        }
      });
    },

    listAll: function (id) {
      return $http.get('/api/files/all/' + id);
    },

    listImages: function (id) {
      //console.log(id);
      return $http.get('/api/files/images/' + id);
    },

    // Nguyen's added function for files in category
    downloadImg: function (userid) {
      return $http.get('/api/avatar/' + userid, { responseType: 'arraybuffer', cache: true }).then(function (data, status, headers, config) {
        var file = new Blob([data], { type: headers('Content-Type') });
        var fileURL = URL.createObjectURL(file);
        $scope.fileURL = $sce.trustAsResourceUrl(fileURL);
        return $scope.fileURL;
      });
    },

    fileShare:function(data) {
      return $http.post('/api/files/share', data);
    },

    getFileCatData:function(categoryId){
    /*  return $http.get('/api/categoryFunction/' + categoryId);*/
    var deferred = $q.defer();
      $http.get('/api/categoryFunction/' + categoryId)
      .then(function (data) {
         deferred.resolve(data);
       });
      return deferred.promise;  
    }
    //end of Nguyen's functions
  };
}])

  // display a user's image by filename
.directive('userImg', ['$http', '$sce', 'md5', function ($http, $sce, md5) {
  return {
    restrict: 'E',
    controller: function ($http, $sce, $scope) {
      $scope.$watch('filename', function () {
        if ($scope.filename) $http.get('/api/files/' + $scope.userid + '/' + $scope.filename, { responseType: 'arraybuffer', cache: true })
          .success(function (data, status, headers, config) {
            var file = new Blob([data], { type: headers('Content-Type') });
            var remoteMD5 = headers('Content-MD5');
            //var reader = new FileReader();
            //reader.addEventListener("loadend", function () {
            //  console.log('Local MD5: ' + md5.createHash(reader.result));
            //  // reader.result contains the contents of blob as a typed array
            //});
            //reader.readAsArrayBuffer(file);
            //console.log('Remote MD5: ' + remoteMD5);
            var fileURL = URL.createObjectURL(file);
            $scope.fileURL = $sce.trustAsResourceUrl(fileURL);
          });
      });
    },
    scope: {
      userid: '@',
      filename: '@',
      css: '@',
      style: '@'
    },
    template: '<img ng-if="fileURL != \'\'" ng-src="{{fileURL}}" style="{{style}}" class="{{css}}" />'
  }
}])

  // directive for inline profile image
.directive('profileImg', ['$http', '$sce', function ($http, $sce) {
  return {
    restrict: 'E',
    controller: function ($http, $sce, $scope) {
      // initial image url once userid is loaded
      $scope.$watch('userid', function () {
        if ($scope.userid) $http.get('/api/avatar/' + $scope.userid, { responseType: 'arraybuffer', cache: true })
          .success(function (data, status, headers, config) {
            var file = new Blob([data], { type: headers('Content-Type') });
            var fileURL = URL.createObjectURL(file);
            $scope.fileURL = $sce.trustAsResourceUrl(fileURL);
          });
      });
    },
    scope: {
      userid: '@',
      css: '@',
      style: '@'
    },
    template: '<img ng-if="fileURL != \'\'" ng-src="{{fileURL}}" style="{{style}}" class="{{css}}" />'
  }
}])

  // directive for inline document display
.directive('userFile', ['$http', '$sce', function ($http, $sce) {
  return {
    restrict: 'E',
    controller: function ($http, $sce, $scope) {
        $scope.$watch('userid', function () {
          if ($scope.userid && $scope.filename) $http.get('/api/files/' + $scope.userid + '/' + $scope.filename, { responseType: 'arraybuffer' })
            .success(function (data, status, headers, config) {
              $scope.filetype = headers('Content-Type');
              var file = new Blob([data], { type: $scope.filetype });
              var fileURL = URL.createObjectURL(file);
              $scope.fileURL = $sce.trustAsResourceUrl(fileURL);
            });
        });
    },
    scope: {
      userid: '@',
      filename: '@',
      css: '@',
      style: '@'
    },
    template: '<object ng-if="fileURL != \'\'" data="{{fileURL}}" style="{{style}}" class="{{css}}" type="{{filetype}}"></object>'
  }
}]);

