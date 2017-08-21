'use strict';
(function(){

class CategoryComponent {
  constructor(Modal) {
    this.message = 'Hello';
  }
}

angular.module('materialShopApp')
  .component('category', {
    templateUrl: 'app/category/category.html',
    controller: CategoryComponent
  });

})();


