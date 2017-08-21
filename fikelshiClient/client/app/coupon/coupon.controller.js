'use strict';

angular.module('materialShopApp')
  .controller('CouponCtrl', function ($scope) {
    $scope.options = [
      {field: 'code'},
      {field: 'amount', dataType: 'currency'},
      {field: 'minimumCartValue', dataType: 'number'},
      {field: 'info'},
      {field: 'type'},
      {field: 'active', dataType: 'boolean'}
    ];
  });
