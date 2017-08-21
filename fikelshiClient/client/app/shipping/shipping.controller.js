'use strict';

angular.module('materialShopApp')
  .controller('ShippingCtrl', function ($scope) {
    $scope.options = [
      {field: 'carrier'},
      {field: 'country'},
      {field: 'charge', dataType:'currency'},
      {field: 'minWeight', dataType:'number'},
      {field: 'maxWeight', dataType:'number'},
      {field: 'freeShipping', dataType:'currency'},
      {field: 'active', dataType: 'boolean'}
    ];
  });
