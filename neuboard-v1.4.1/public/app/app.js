// angular.module('userApp', ['ngAnimate', 'app.routes', 'socketService', 'authService', 'mainCtrl', 'userCtrl',
//   'userService', 'vaultCtrl', 'vaultService', 'processCtrl', 'processService', 'eventCtrl', 'eventService',
//   'participantCtrl', 'participantService', 'chatCtrl', 'chatService','agreementCtrl','agreementService', 'roleCtrl', 
//   'fileService', 'ui.bootstrap'])

angular.module('userApp', ['ngAnimate', 'app.routes', 'socketService', 'authService', 'mainCtrl', 'userCtrl',
  'userService', 'vaultCtrl', 'vaultService', 'processCtrl', 'processService', 'eventCtrl', 'eventService',
  'participantCtrl', 'participantService', 'chatCtrl', 'chatService', 'roleCtrl', 'panelCtrl', 'agreementService', 'agreementCtrl',
  'fileService', 'ui.bootstrap', 'panels', 'tc.chartjs', 'ngToast', 'ngSanitize', 'agreementCatService',
  'screenCtrl', 'sidebarCtrl', 'fileCtrl', 'adminService', 'adminCtrl'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});