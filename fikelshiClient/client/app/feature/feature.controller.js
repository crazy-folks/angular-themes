'use strict';

angular.module('materialShopApp')
  .controller('FeatureCtrl', function ($scope) {
    $scope.options = [
      {field: 'key'},
      {field: 'val'},
      {field: 'active', dataType: 'boolean'}
    ];
  });
