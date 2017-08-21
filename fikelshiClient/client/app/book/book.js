'use strict';

angular.module('materialShopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('book', {
        url: '/book',
        templateUrl: 'app/book/book.html',
        controller: 'BookCtrl',
        authenticate: true,
        title: 'Books Management'
      });
  });
