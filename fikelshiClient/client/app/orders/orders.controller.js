'use strict';

(function() {

class OrdersController {
  constructor(Cart,Country,PaymentMethod,Shipping,Coupon,Order,Toast, Settings,$state) {
    this.orderStatusLov = Order.status;
        this.Order = Order;
        this.Toast = Toast;
        this.Settings = Settings;
        this.$state = $state;
        this.options = {};
        this.orders = Order.query();
  }

  navigate(params){
      this.$state.go('single-product', {id:params.sku,slug:params.description}, {reload: false});
  }

  changeStatus(order){
    var vm = this
    var vm = this
    this.Order.update({ id:order._id }, order).$promise.then(function(res) {
    }, function(error) { // error handler
      if(error.data.errors){
        vm.Toast.show({
          type: 'error',
          text: error.data.errors.status.message
        });
      }
      else{
        vm.Toast.show({
          type: 'success',
          text: error.statusText
        });
      }
    });
  }

}

angular.module('materialShopApp')
  .controller('OrdersController', OrdersController);

})();

    