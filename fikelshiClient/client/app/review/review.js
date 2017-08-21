'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('review', {
        url: '/review',
        templateUrl: 'app/review/review.html',
        controller: 'ReviewController as review',
        authenticate: true
      })
  });