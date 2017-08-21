'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('brand', {
        url: '/brand',
        templateUrl: 'app/brand/brand.html',
        controller: 'BrandCtrl',
        authenticate: 'manager'
      });
  });
