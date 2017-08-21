'use strict';

(function() {

class OrderController {
    constructor(Cart,Order,Toast, Settings,$state,$stateParams) {
        this.orderStatusLov = Order.status;
        this.Toast = Toast;
        this.Settings = Settings // Used to get currency symbol
        this.$state = $state;
        this.options = {};
        this.orders = Order.my.query()
        this.payment = $stateParams
        if($stateParams.id) // If payment was successful clear cart
          Cart.cart.clearItems()
    }

    navigate(params){
       this.$state.go('single-product', {id:params.sku,slug:params.description}, {reload: false});
    }

    
}

angular.module('materialShopApp')
  .controller('OrderController', OrderController);

})();

    