'use strict';

angular.module('materialShopApp')
  .controller('CountryCtrl', function ($scope) {
    $scope.options = [
      {field: 'name'},
      {field: 'dial_code'},
      {field: 'code'},
      {field: 'active', dataType: 'boolean'}
    ];
  });
