'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('right-menu', {
        url: '/right-menu',
        templateUrl: 'components/right-menu/right-menu.html',
        controller: 'RightMenuCtrl'
      });
  });
