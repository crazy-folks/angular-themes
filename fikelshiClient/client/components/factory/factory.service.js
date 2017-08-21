'use strict';

angular.module('materialShopApp')
.factory('Product', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/products/:id', null, {'update': { method:'PUT' } });
    obj.count = $resource('/api/products/count');
    obj.pr = $resource('/api/products/priceRange');
    return obj;
}])

.factory('Shipping', ['$resource', function($resource) {
    var obj = {};
    obj = $resource('/api/shippings/:id', null, {'update': { method:'PUT' }});
    obj.best = $resource('/api/shippings/best', null, {'update': { method:'PUT' }});
    return obj;
}])

.factory('Category', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/categories/:id', null, {'update': { method:'PUT' }});
  obj.loaded = $resource('/api/categories/loaded');
  obj.tree = $resource('/api/categories/tree');
  return obj;
}])
.factory('Cat', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/cats/:id', null, {'update': { method:'PUT' }});
  obj.headings = $resource('/api/cats/headings');
  return obj;
}])
.factory('Country', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/countries/:id', null, {'update': { method:'PUT' }});
  obj.active = $resource('/api/countries/active', null, {'update': { method:'PUT' }});
  return obj;
}])
.factory('Brand', ['$resource', function($resource) {
  return $resource('/api/brands/:id', null, {'update': { method:'PUT' } });
}])
.factory('Coupon', ['$resource', function($resource) {
  return $resource('/api/coupons/:id', null, {'update': { method:'PUT' } });
}])
.factory('Address', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/address/:id', null, {'update': { method:'PUT' } });
  obj.my = $resource('/api/address/my', null);
  return obj;
}])
.factory('Feature', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/features/:id', null, {'update': { method:'PUT' } });
  obj.group = $resource('/api/features/group', null, {'update': { method:'PUT' }});
  return obj;
}])
.factory('PaymentMethod', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/PaymentMethods/:id', null, {'update': { method:'PUT' } });
  obj.active = $resource('/api/PaymentMethods/active', null, {'update': { method:'PUT' }});
  return obj;
}])
.factory('Order', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/orders/:id', null, {'update': { method:'PUT' } });
  obj.my = $resource('/api/orders/my', null, {'update': { method:'PUT' }});
  return obj;
}])
.factory('Pay', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/pay/:id', null, {'update': { method:'PUT' } });
  obj.prepare = $resource('/api/pay/prepare');
  obj.stripe = $resource('/api/pay/stripe');
  return obj;
}])
.factory('Review', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/reviews/:id', null, {'update': { method:'PUT' } });
  obj.my = $resource('/api/reviews/my');
  return obj;
}])
.factory('Wishlist', ['$resource', function($resource) {
  var obj = {};
  obj = $resource('/api/wishlists/:id', null, {'update': { method:'PUT' } });
  obj.my = $resource('/api/wishlists/my');
  return obj;
}])
.factory('Mail', ['$resource', function($resource) {
  return $resource('/api/sendmail/:id');
}]);