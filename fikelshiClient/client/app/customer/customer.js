'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('customer', {
        url: '/customer',
        templateUrl: 'app/customer/customer.html',
        controller: 'CustomerCtrl',
        authenticate: true
      });
  });
