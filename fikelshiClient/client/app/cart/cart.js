'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cart', {
        url: '/cart',
        templateUrl: 'app/cart/cart.html',
        controller: 'CartController as cart',
        authenticate: true
      });
  });
