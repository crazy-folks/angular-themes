(function () {
	'use strict';

	angular
		.module('materialShopApp')
		.factory('PageOptions', PageOptions);

	function PageOptions() {
    var obj = {};
 	  obj.leftmenu = false;
 	  return obj;
  }
})();
