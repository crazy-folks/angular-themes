var module = angular.module('fileCtrl', ['vaultService','ngFileUpload'])

module.controller('fileController', ['Category', '$scope', 'ngToast', '$rootScope', 'Files', 'AgreementCategory', '$filter', '$http', function(Category, $scope, ngToast,$rootScope, Files,AgreementCategory,$filter,$http) {
	var vm = this;

	$scope.init = function() {
		vm.processing = true;
        Category.initial().then(function(data) {
            $scope.getFilesCategories();
        });
    };
    $scope.init();

    // open panel to add file
    $scope.openFileAdd = function() {
        $scope.action = "add";
        $scope.data = {};
        openPanel(true, "addFileCategory");
    }

    function openPanel(show, name) {
        //console.log(show + " " + name);
        $scope.showPanel = show;
        $scope.panel = name;
    }

    //function to add a file category
    $scope.addFileCategory = function(data) {
        Category.addFileCategory(data);
        openPanel(false, "addFileCategory");
        $scope.getFilesCategories();
    }

    $scope.deleteFCategory = function(data) {
        $scope.deleteFCatItem = data;
        openPanel(false, "addFileCategory");
    }

    $scope.confirmDeleteCat = function(data) {
        Category.deleteFCat(data);
        $scope.closeAlerts();
        $scope.getFilesCategories();
    }

    $scope.closeAlerts = function() {
        $scope.deleteFCatItem = null;
    }

    $scope.editFilesCat = function(data) {
        if(data.categoryName == 'Filled Forms'){
            openPanel(false, '');
            throwToast("info", "Edit the Filled Forms name is not allowed at this point");
        } else {
            openPanel(true, "addFileCategory")
            $scope.action = "update";
            $scope.fileCat = data;
        }    
    }

    $scope.updateFileCategory = function(data) {
        Category.updateFileCategory(data);
        openPanel(false, '');
    }

    function throwToast (type, message) {
        ngToast.create({
            className: type,
            content: message,
            dismissOnClick: true,
            dismissButton: true
        });
    }

    $scope.cancel = function() {
        openPanel(false, '');
    }

    $scope.opened = function (fileCategory, index) {
    	if(fileCategory.categoryName == 'Filled Forms'){
            $scope.disabledFileUpload = true;
        } else {
            $scope.disabledFileUpload = false;
        }
        openPanel(true, "addingFiles");
        $rootScope.filesCat = fileCategory;
        getFiles(); 
    }

    $scope.$on('filesReturn', function(event, args) {
        //console.log(args);
        $scope.fileVar = { maxSize: 5, currentPage: 1, numPerPage: 8};
        $scope.filteredFiles = [];
        $scope.totalItems = args.filesR.data.data.length;
        $scope.fFiles = args.filesR.data.data;

        $scope.numPages = function () {
            return Math.ceil($scope.totalItems / $scope.fileVar.numPerPage);
        };

        $scope.changePage = function () {
            var begin = (($scope.fileVar.currentPage - 1) * $scope.fileVar.numPerPage)
            , end = begin + $scope.fileVar.numPerPage;
            $scope.filteredFiles = $scope.fFiles.slice(begin, end);
        };
        $scope.changePage();
        //console.log($scope.fFiles);
    });

    $scope.alerts = [];
    $scope.deletefCatFile = function(fileImg) {
        $scope.alerts.push({
                type: 'info',
                msg: 'Deleting file: ' + fileImg.filename
            })
            // Remove file, pass an alert and on success, call init:
        Category.removeFiles($rootScope.filesCat._id, fileImg, getFiles(), $scope.alerts);
        getFiles();
    };

    $scope.userDownloadFiles = function(userfile) {
        $rootScope.userFilename = userfile.filename;
        Category.userFileDownload($rootScope.userFilename, userfile);
    };

    $scope.mySharedFiles = function() {
        openPanel(true, "mySharedFiles")
        getSharedFile();
    }

    var getSharedFile = function() {
        $scope.loadingFileStatus = true;
        Category.findSharedFiles()
            .then(function(data) {
                $scope.loadingFileStatus = false;
                $scope.fileVar = { maxSize: 5, currentPage: 1, numPerPage: 6};
                $scope.filteredFiles = [];
                $scope.totalItems = data.data.length;
                $scope.sharedFiles = data.data;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.fileVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.fileVar.currentPage - 1) * $scope.fileVar.numPerPage)
                    , end = begin + $scope.fileVar.numPerPage;
                    $scope.filteredFiles = $scope.sharedFiles.slice(begin, end);
                };
                $scope.changePage();              
            })
    }

    $scope.deleteFileAgreement = function(data) {
        AgreementCategory.delete(data)
            .success(function(dataReturn) {
                throwToast(dataReturn.type, dataReturn.message);
                getSharedFile();
            })
    }

    $scope.extendTimeShare = function(item) {
        AgreementCategory.extendAgreementTime(item._id, 1)
        .success(function(dataReturn){
            throwToast(dataReturn.type, dataReturn.message);
        })
    }

    $scope.initSharing = function() {
        $scope.cancel();
        $scope.nameShare = [];
        $scope.processing = true;
        loadMyShare();
    };

    $scope.downloadFile = function(fileItem) {
       // console.log(fileItem);
        var result =  ((new Date(fileItem.enddatetime).getTime()) < (new Date().getTime())) ? true:false;
        //console.log(result);
        if(result == false) {
            $rootScope.filename = fileItem.name;
            $http.get('/api/fileDownload/' + fileItem.fileid, {
                responseType: 'arraybuffer'
            })
            .success(function(data, status, headers, config) {
                $scope.filetype = headers('Content-Type');
                $scope.check = headers('Date');
                var file = new Blob([data], {
                    type: $scope.filetype
                });

                if(fileItem.readonlyaccess == 'true') {
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    AgreementCategory.extendAgreementTime(fileItem._id, 2)
                        .success(function(dataReturn){
                        throwToast(dataReturn.type, dataReturn.message);
                    })
                } else {
                    saveAs(file, $rootScope.filename);
                    throwToast("success", "You have downloaded the file at " + $scope.check);
                }      
            });
            } else {
                throwToast("info", "You can't download the expired file: " + fileItem.name);
        } 
    };

    $scope.toNormalDate = function(data) {
        $scope.normalDate = $filter('date')(data, "MM/dd/yyyy");
    }

    $scope.compareDate = function(data) {
       if ((new Date(data).getTime()) <= (new Date().getTime())) {
            $scope.result = true;
        } else {
            $scope.result = false;
        }
    }

    $scope.extendTimeShare = function(item) {
        AgreementCategory.extendAgreementTime(item._id, 1)
        .success(function(dataReturn){
            throwToast(dataReturn.type, dataReturn.message);
        })
    }

    $scope.deleteAgreementView = function(item) {
        AgreementCategory.delete(item)
            .success(function(data) {
                throwToast(data.type, data.message);
                $scope.initSharing();
            });
    }

    $scope.$watch('files', function() {
        if($rootScope.filesCat) {
            if($rootScope.filesCat.categoryName == 'Filled Forms') {
                //throwToast("info", "You can't upload file/files for this category");
                console.log("Can't upload file");
            } else {
                $scope.uploadFile($scope.files, $rootScope.filesCat);
            }
        }     
    });

    $scope.uploadFile = function(files, fileCategory) {
        if (!files) {
            return
        };
        if (!$rootScope.filesCat._id) {
            return;
        } else
            Category.uploadFileCategory(files, fileCategory, getFiles, $scope.alerts);
    };

    // function to get the file cateogries
    // need to be last for timing loading
    function loadMyShare() {
        Category.loadMyContent()
            .then(function(data) {
                vm.processing = false;
                openPanel(true, "mySharingView");
                $scope.mySharingData = data.data;
                $scope.fileVar = { maxSize: 5, currentPage: 1, numPerPage: 5};
                $scope.filteredFiles = [];
                $scope.totalItems = data.data.length;

                $scope.numPages = function () {
                    return Math.ceil($scope.totalItems / $scope.fileVar.numPerPage);
                };

                $scope.changePage = function () {
                    var begin = (($scope.fileVar.currentPage - 1) * $scope.fileVar.numPerPage)
                    , end = begin + $scope.fileVar.numPerPage;
                    $scope.filteredFiles = $scope.mySharingData.slice(begin, end);
                };
                $scope.changePage();   
            });
    };

    var getFiles = function() {
        $scope.loadingFileStatus = true;
        //console.log("id " + $rootScope.filesCat._id);
        Files.getFileCatData($rootScope.filesCat._id)
            .then(function(data) {
                $rootScope.$broadcast('filesReturn', {
                    filesR: {
                        data
                    }
                });
                /*$scope.fFiles = data;
                console.log($scope.fFiles);*/
                $scope.loadingFileStatus = false;
            })
    }

    $scope.getFilesCategories = function() {
        vm.processing = true;
        Category.getFileCategory()
            .then(function(data) {
                vm.processing = false;
                $scope.fCategories = data.data;
                //console.log(data.data);
            })
    }

}]);