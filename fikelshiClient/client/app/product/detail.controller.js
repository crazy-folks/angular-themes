'use strict';
(function() {

function ProductsDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket, $scope) {
  var vm = this;
  vm.myDate = new Date();
  vm.header = 'product';
  vm.product = {};
  vm.options = {};
  vm.product.variants = [];
  vm.product.newVariant = {};
  vm.product.features = [];
  vm.product.keyFeatures = [];
  vm.unsavedProduct = $stateParams.products;
  vm.product = angular.copy($stateParams.products);
  vm.options.categories = angular.copy($stateParams.categories);
  vm.options.brands = angular.copy($stateParams.brands);
  vm.options.variants = angular.copy($stateParams.variants);
  vm.options.features = angular.copy($stateParams.features);
  vm.options.keyFeatures = angular.copy($stateParams.keyFeatures);

  // The whole category hierarchy
  vm.loading = true;
  $http.get('/api/categories/all').then(function(res) {
    vm.loading = false;
    vm.options.categories = res.data;
  },handleError);
  
  vm.mediaLibrary = function(index){
    $mdDialog.show({
      template: `<md-dialog aria-label="Media Library" ng-cloak flex="95">
        <md-toolbar class="md-warn">
          <div class="md-toolbar-tools">
            <h2>Media Library</h2>
            <span flex></span>
            <md-button class="md-icon-button" ng-click="cancel()">
              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-dialog-content>
            <div class="md-dialog-content"  class="md-whiteframe-z2">
                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">
                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">
                		<div class="thumbnail">
                				<img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">
                		</div>
                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>
                  </md-grid-tile>
                </md-grid-list>
          </div>
        </md-dialog-content>
        <md-dialog-actions layout="row">
          <span flex></span>
          <md-button ng-click="addNewImage()" class="md-warn md-raised">
           Add new Image
          </md-button>
        </md-dialog-actions>
      </md-dialog>
`,
      controller: function($scope, $mdDialog, $http, socket, $state) {
        // Start query the database for the table
        var vm = this
        $scope.loading = true;
        $http.get('/api/media/').then(function(res) {
          $scope.loading = false;
          $scope.media = res.data;
          socket.syncUpdates('media', $scope.data);
        }, handleError);

        function handleError(error) { // error handler
            $scope.loading = false;
            if(error.status === 403){
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            }
            else{
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
        }
        $scope.ok = function(path){
          $mdDialog.hide(path);
        }
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.addNewImage = function(){
          $state.go('media');
          vm.save(vm.product)
          $mdDialog.hide();
        }
      }

    }).then(function(answer) {
      if(index===1000000)
        vm.product.variants.push({size:'x', image:answer})
      else
        vm.product.variants[index].image = answer;
    }, function() {
    });
  }

  function goBack() {
    ToggleComponent('products.detailView').close();
    $state.go('^', {}, { location: false });
  }
  vm.goBack = goBack;

  vm.save = function(product) {
    // refuse to work with invalid data
    if(!product){
      Toast.show({
        type: 'error',
        text: 'No product defined.'
      });
      return;
    }
    if('newVariant' in product){
      vm.product.variants.push(product.newVariant);
    }
    
    $http.put('/api/products/'+product._id, product)
    .then(success)
    .catch(err);
    function success(res) {
      var item = vm.product = res.data;
      Toast.show({
        type: 'success',
        text: 'Product has been updated'
      });
    }

    function err(err) {
      if (product && err) {
      }

      Toast.show({
        type: 'warn',
        text: 'Error while updating database'
      });
    }
  };

  vm.deleteFeature = function(index,product) {
    vm.product.features.splice(index, 1);
    vm.save(product)
  };

  vm.deleteKF = function(index,product) {
    vm.product.keyFeatures.splice(index, 1);
    vm.save(product)
  };

  vm.deleteVariants = function(index,product) {
    vm.product.variants.splice(index, 1);
    vm.save(product)
  };
function handleError(error) { // error handler
      vm.loading = false;
      if(error.status === 403){
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      }
      else{
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
  }
}

angular.module('materialShopApp')
  .controller('ProductsDetailController', ProductsDetailController);

})();
