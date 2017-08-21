'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('shipping', {
        url: '/shipping',
        templateUrl: 'app/shipping/shipping.html',
        controller: 'ShippingCtrl',
        authenticate: 'manager'
      });
  });
