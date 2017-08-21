'use strict';
(function() {
angular.module('materialShopApp')
.constant('Settings', {
  demo: false,
  country: {
    name:'India', 
    code: 'IN' // must be 2 digit code from the list https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 
  },
  currency: {
    code: 'USD', // Paypal currency code *** Please choose from https://developer.paypal.com/docs/classic/api/currency_codes/
    shop_currency: 'INR',
    symbol: 'Rs ', // Currency symbol to be displayed through out the shop
    exchange_rate: '0.015' // Paypal currency code(USD) / Shop currency (INR) ***  exchange_rate should not be 0 else it will generate divided by 0 error
  }, 
  paymentStatus: ['Pending','Paid','created'], // On success from Paypal it stores as created
  orderStatus: ['Payment Pending','Order Placed','Order Accepted','Order Executed','Shipped','Delivered','Cancelled','Not in Stock'],
  menu: {
    pages : [ // Main menu
      {text:'Orders', url: 'order', authenticate: true, icon: 'shopping_basket'},
      {text:'Manage Orders', url: 'orders', authenticate: true, role: 'manager', icon: 'shopping_basket'},
      {text:'Address', url: 'address', authenticate: true, icon: 'directions'},
      {text:'Reviews', url: 'review', authenticate: true, icon: 'star'},
      {text:'Moderate Reviews', url: 'reviews', authenticate: true, role: 'admin', icon: 'star'},
      {text:'Wishlist', url: 'wish', authenticate: true, icon: 'favorite'},
      {text:'Media Library', url: 'media', authenticate: true, role: 'manager', icon: 'photo_library'},
      {text:'Products', url: 'product', authenticate: true, role: 'manager', icon: 'style'},
      {text:'Brands', url: 'brand', authenticate: true, role: 'manager', icon: 'verified_user'},
      {text:'Caterories', url: 'category', authenticate: true, role: 'manager', icon: 'subject'},
      {text:'Coupons', url: 'coupon', authenticate: true, role: 'admin', icon: 'receipt'},
      {text:'Features', url: 'feature', authenticate: true, role: 'manager', icon: 'spellcheck'},
      {text:'Payment Methods', url: 'payment-method', authenticate: true, role: 'admin', icon: 'payment'},
      {text:'Shippings', url: 'shipping', authenticate: true, role: 'admin', icon: 'local_shipping'}
    ],
    user : [ // Separate panel for user management tasks for both admin and user
      {text:'Users', url: 'admin', authenticate: true, role: 'admin', icon: 'perm_identity'},
      {text:'Change Password', authenticate: true, url: 'cp', icon: 'settings_applications'},
      {text:'logout', authenticate: true, url: 'logout', icon: 'logout'}
    ]    
  }
});
})();
