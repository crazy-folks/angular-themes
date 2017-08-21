'use strict';

angular.module('materialShopApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('/', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        title: 'Online Shopping India | Buy Online'
      })
      .state('/Category', {
        url: '/Category',
        templateUrl: 'app/main/test.html',
        controller: 'MainController as main',
        title: 'Categories'
      })
      .state('single-product', {
        params: {id: null, name: null, slug: null, search:false},
        url: '/p/:slug',
        templateUrl: 'app/main/single-product.html',
        controller: 'SingleProductController as single',
        title: 'Product details',
        resolve: {
            SingleProduct : function ($stateParams,Product) {
            // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
            var id = $stateParams.id;
            if (localStorage !== null && JSON !== null && id !== null) {
                localStorage.productId = id;
            }
            var productId = localStorage !== null ? localStorage.productId : null;

            if (productId) { // != null
                return Product.get({id:productId})
            }

            // return productId;
          }
        }
      })
      .state('main', {
        title: 'eCommerce Fashion Store Using AngularJS - ShopNx',
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        params: {
          sort: null
        }
      })
      // When a category selected from the navbar megamenu
      .state('SubProduct', {
        title: 'All products under current category or brand',
        url: '/:page/:slug/:_id',
        templateUrl: 'app/main/main.html',
        controller: 'MainController as main',
        params: {
          id: null,
          sort: null,
          brand: null,
          category: null,
          price1: 0,
          price2: 100000
        }
      });
  });
