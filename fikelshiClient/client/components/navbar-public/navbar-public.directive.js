'use strict';

angular.module('materialShopApp')
  .directive('navbarPublic', function () {
    return {
      templateUrl: 'components/navbar-public/navbar-public.html',
      restrict: 'E',
      controller: 'NavbarPublicController',
      controllerAs: 'vm'
    };
  });
