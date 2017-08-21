'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wish', {
        url: '/wish',
        templateUrl: 'app/wish/wish.html',
        controller: 'WishController as wish',
        authenticate: true
      })
  });