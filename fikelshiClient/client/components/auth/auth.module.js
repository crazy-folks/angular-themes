'use strict';

angular.module('materialShopApp.auth', [
  'materialShopApp.constants',
  'materialShopApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
