'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('feature', {
        url: '/feature',
        templateUrl: 'app/feature/feature.html',
        controller: 'FeatureCtrl',
        authenticate: 'manager'
      });
  });
