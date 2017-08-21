angular.module('app.routes', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/dashboard");

  $stateProvider

		// login page
		.state('login', {
      	  url: '/login',
		  views: {
        'content@': {
          templateUrl: 'app/views/pages/login.html',
          controller: 'mainController',
          controllerAs: 'login'
        }
      },
			data: {
				pageTitle: 'Login'
			}
		})

		//new user
		.state('newUser', {
			url: '/newUser',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/newUser.html',
          controller: 'newUserController',
          controllerAs: 'newUser'
        }
      },
      data: {
        pageTitle: 'New User Signup'
      }
		})

		// users
		.state('users', {
		  url: '/users',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/users/all.html',
          controller: 'userController',
          resolve: {
            'FilesData': function (Files) {
              return Files.initial;
            }
          }
        }
      },
			data: {
				pageTitle: 'Users'
			}
		})

		// form to create a new user
		// same view as edit page
		.state('usersCreate', {
		  url: '/users/create',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/users/single.html',
          controller: 'userCreateController',
          controllerAs: 'user',
          resolve: {
            'FilesData': function (Files) {
              return Files.initial;
            }
          }
        }
      },
			data: {
				pageTitle: 'Create New User'
			}
		})

		// page to edit a user
		.state('usersEdit', {
		  url: '/users/:user_id',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/users/single.html',
          controller: 'userEditController',
          controllerAs: 'user',
          resolve: {
            'FilesData': function (Files) {
              return Files.initial;
            }
          }
        }
      },
			data: {
				pageTitle: 'Edit User'
			}
		})

		.state('profile', {
			url: '/profile/:user_id',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/users/profile.html',
          controller: 'userEditController',
          controllerAs: 'user',
          resolve: {
            'FilesData': function (Files) {
              return Files.initial;
            }
          }
        }
      },
			data: {
				pageTitle: 'Edit Profile'
			}
		})

		// dashboard page
		.state('dashboard', {
		  url: '/dashboard',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/dashboard/dashboard.html',
          controller: 'mainController',
          controllerAs: 'main',
          resolve: {
            'ProcessData': function (Processes) {
              return Processes.initial;
            },
            'EventData': function (Events) {
              return Events.initial;
            }
          }
        },
//--------------------------------PANELS for DASHBOARD----------------------------------------------
        'messages@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/messagePanel.html'
        },
        'files@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/filesPanel.html'
        },
        'vault@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/vaultPanel.html'
        },
        'notifications@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/notification.html'
        },
        'events@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/eventPanel.html'
        },
        'customerProcesses@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/customerProcesses.html'
        },
        'inProgress@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/processInProgressPanel.html'
        },
        'process@dashboard': {
          templateUrl: 'app/views/pages/dashboard/panels/processPanel.html'
        }
      },
			data: {
				pageTitle: 'Dashboard'
			}
		})
//---------------------------------------------------------------------------------------------------


		// vault page
		.state('vault', {
		  url: '/vault',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/vault/vault.html',
          controller: 'vaultController',
          controllerAs: 'vault'
        }
      },
			data: {
				pageTitle: 'Vault'
			}

		})

		.state('vault.edit', {  // edit vault extra method by open html to edit
		  url: '/vault/:vault_id',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/vault/partial/vaultEdit.html',
          controller: 'vaultEditCtrl',
          controllerAs: 'vault'
        }
      }
		})

		.state('vaults.category', {  // when click on the menu to open associated page
		  url: '/vaults/:vault_id',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/vault/partial/vaultCategory.html',
          controller: 'vaultController',
          controllerAs: 'vault'
        }
      }
		})


		// processes page
		.state('processes', {
			abstract: true,
      views: {
        'content@': {
          url: '/processes',
          templateUrl: "app/views/pages/theme/common.html"
        }
      },
			data: {
				pageTitle: 'Processes'
			}
		})

		.state('processes.new', {
			url: '/new/:page',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/newProcess.html',
          controller: 'wizardCtrl',
          controllerAs: 'wizard'
        }
      },
			data: {
				pageTitle: 'New Process'
			}
		})

		.state('processes.view', {
			url: '/view',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/Processes.html',
          controller: 'processController',
          controllerAs: 'processes'
        }
      },
			data: {
				pageTitle: 'View Processes'
			}
		})

    // process apps
    .state('processesEmail', {
		  url: '/processes/email',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/emailProcess.html',
          controller: 'processController',
          controllerAs: 'processes'
        }
      }
		})
		/*.state('processesNew', {
		  url: '/processes/:name',
		  templateUrl: 'app/views/pages/processes/newApp.html',
		  controller: 'processController',
		  controllerAs: 'processes'
		})*/

		.state('processesNews', {
		  url: '/processes/:name',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/newApp.html',
          controller: 'processController',
          controllerAs: 'processes'
        }
      }
		})

		.state('newProcess', {
		  url: '/aProcess/:page',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/newProcess.html',
          controller: 'wizardCtrl',
          controllerAs: 'wizard'
        }
      }
		})

		.state('editProcess', {
		  url: '/editProcess/:page',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/editProcess.html',
          controller: 'wizardCtrl',
          controllerAs: 'wizard'
        }
      }
		})

		.state('editProcess.edit_one', {
            url: "/edit_one",
            templateUrl: "app/views/pages/processes/editstep_one.html"
        })

        .state('editProcess.edit_two', {
            url: "/edit_two",
            templateUrl: "app/views/pages/processes/editstep_two.html"
        })
        .state('editProcess.edit_three', {
            url: "/edit_three",
            templateUrl: "app/views/pages/processes/editstep_three.html"
        })
        .state('editProcess.edit_fourth', {
            url: "/edit_fourth",
            templateUrl: "app/views/pages/processes/editstep_fourth.html"
        })

		.state('newProcess.step_one', {
            url: "/step_one",
            templateUrl: "app/views/pages/processes/step_one.html"
        })
        .state('newProcess.step_two', {
            url: "/step_two",
            templateUrl: "app/views/pages/processes/step_two.html"    
        })
        .state('newProcess.step_three', {
            url: "/step_three",
            templateUrl: "app/views/pages/processes/step_three.html" 
        })
         .state('newProcess.step_fourth', {
            url: "/step_fourth",
            templateUrl: "app/views/pages/processes/step_fourth.html" 
        })

		/*.state('processesNewse', {
		  url: '/process/LoanApp',
		  templateUrl: 'app/views/pages/processes/LoanApp.html',
		  controller: 'processController',
		  controllerAs: 'processes'
		})*/
		
		.state('viewFile', {
		  url: '/viewFile/:file',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/viewFile.html',
          controller: 'processController',
          controllerAs: 'processes'
        }
      }
		})

		.state('autoViewFile', {
		  url: '/autoViewFile/:viewFile',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/processes/viewFile.html',
          controller: 'processController',
          controllerAs: 'processes'
        }
      }
		})

		// participants page
		.state('participants', {
		  url: '/participants',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/participants/Participants.html',
          controller: 'participantController',
          controllerAs: 'part'
        }
      },
			data: {
				pageTitle: 'Participants'
			}
		})

		.state('files', {
		  url: '/files',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/files/files.html',
          controller: 'fileController',
          controllerAs: 'file'
        }
      },
			data: {
				pageTitle: 'Files'
			}
		})

		// agreements page
		.state('agreements', {
		  url: '/agreements',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/agreements/Agreements.html',
          controller: 'vaultController',
          controllerAs: 'vault'
        }
      },
			data: {
				pageTitle: 'Agreements'
			}
		})

		/* not using right now
		// agreements creation page
		.state('agreementsCreate', {
		  url: '/agreements/create',
		  templateUrl: 'app/views/pages/agreements/partial/createAgreement.html',
		  controller: 'agreementCreateController',
		  controllerAs: 'agreements'
		})
		// agreements edit page
		.state('agreementsEdit', {
		  url: '/agreements/:agreement_id',
		  templateUrl: 'app/views/pages/agreements/partial/createAgreement.html',
		  controller: 'agreementEditController',
		  controllerAs: 'agreements',
		}) */

		// ROLES ----------------------------------------------------
		// roles page
		.state('roles', {
		  url: '/roles',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/roles/viewRoles.html',
          controller: 'roleController',
          controllerAs: 'role'
        }
      },
			data: {
				pageTitle: 'Roles'
			}
		})

		// form to create a new role
		// same view as edit page
		.state('rolesCreate', {
		  url: '/roles/create',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/roles/role.html',
          controller: 'roleCreateController',
          controllerAs: 'role'
        }
      },
			data: {
				pageTitle: 'Create New Role'
			}
		})

		// page to edit a role
		.state('rolesEdit', {
		  url: '/roles/:name',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/roles/role.html',
          controller: 'roleEditController',
          controllerAs: 'role'
        }
      },
			data: {
				pageTitle: 'Edit Role'
			}
		})

		.state('admin', {
      url: '/admin',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/admin/admin.html',
          controller: 'adminController',
          controllerAs: 'admin'
        }
      },
			data: {
				pageTitle: 'Administration'
			}
    })

		.state('401', {
			url: '/401',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/401.html'
        }
      },
			data: {
				pageTitle: '401'
			}
		})

		.state('404', {
			url: '/404',
      views: {
        'content@': {
          templateUrl: 'app/views/pages/404.html'
        }
      },
			data: {
				pageTitle: '404'
			}
		})
	;


  $locationProvider.html5Mode(true);


});

//.config(function ($httpProvider) {
//  $httpProvider.interceptors.push(function ($q) {
//    return {
//      'request': function (config) {
//        console.log(config);
//        return config || $q.when(config);
//      }
//    };
//  });
//});
