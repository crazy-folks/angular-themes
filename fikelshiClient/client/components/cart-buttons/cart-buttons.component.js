'use strict';
(function(){
class cartButtonsController {
  /*@ngInject*/
  constructor(Cart) {
    this.cart = Cart.cart
    this.addItem = function(product, variant, i){
      i = i || 1;
      this.cart.addItem({sku:product._id, name:product.name, slug:product.slug, mrp:variant.mrp, price:variant.price, quantity:1, image:variant.image,category:product.category, size:variant.size, weight:variant.weight, vid:variant._id} ,i)
    }
  }
}

angular.module('materialShopApp')
  .component('cartButtons', {
    template: `    
        <section class="md-actions cta" layout="row" layout-align="start end" ng-if="$ctrl.cart.checkCart($ctrl.product._id, $ctrl.variant._id)">
            <md-button ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant)" class="md-raised md-primary"
            aria-label="Add to cart">
                <ng-md-icon icon="shopping_cart"></ng-md-icon>Add to cart
            </md-button>
        </section>

        <section class="md-actions cta" layout="row" layout-align="start center" ng-if="!$ctrl.cart.checkCart($ctrl.product._id, $ctrl.variant._id)">
            <md-button class="md-raised md-primary left md-icon-button" 
            ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,-1)" 
            aria-label="Remove from cart">
                <ng-md-icon icon="remove"></ng-md-icon>
            </md-button>

            <md-button class="middle" aria-label="Cart quantity" ui-sref="checkout">Buy {{$ctrl.cart.getQuantity($ctrl.product._id, $ctrl.variant._id)}}</md-button>

            <md-button class="md-raised md-primary right md-icon-button" ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,1)" aria-label="Add to cart">
                <ng-md-icon icon="add"></ng-md-icon>
            </md-button>
        </section>
    `,
    bindings: { 
      product: '<', // One way binding towards controller
      variant: '<', // One way binding towards controller
      readOnly: '@?' // String value
    },
    controller: cartButtonsController
})
})();

