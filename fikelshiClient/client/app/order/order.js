'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('order', {
        url: '/order?id&msg',
        templateUrl: 'app/order/order.html',
        controller: 'OrderController as order',
        authenticate: true
      });
  });
