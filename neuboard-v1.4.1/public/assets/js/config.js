function config($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/index");
  $stateProvider
    .state('index', {
      url: "/index",
      templateUrl: "app/views/pages/theme/index.html",
      data: {
        pageTitle: 'index'
      }
    })
    .state('ui', {
      abstract: true,
      url: "/ui",
      templateUrl: "app/views/pages/theme/common.html"
    })
    .state('ui.buttons', {
      url: "/buttons",
      templateUrl: "app/views/pages/theme/ui-buttons.html",
      data: {
        pageTitle: 'Buttons'
      }
    })
    .state('ui.sliders-progress', {
      url: "/sliders-progress",
      templateUrl: "app/views/pages/theme/ui-sliders-progress.html",
      data: {
        pageTitle: 'Sliders and Progress'
      }
    })
    .state('ui.modals-popups', {
      url: "/modals-popups",
      templateUrl: "app/views/pages/theme/ui-modals-popups.html",
      data: {
        pageTitle: 'Modals and Popups'
      }
    })
    .state('ui.tabs-accordions', {
      url: "/tabs-accordions",
      templateUrl: "app/views/pages/theme/ui-tabs-accordions.html",
      data: {
        pageTitle: 'Tabs and Accordions'
      }
    })
    .state('ui.alerts-notifications', {
      url: "/alerts-notifications",
      templateUrl: "app/views/pages/theme/ui-alerts-notifications.html",
      data: {
        pageTitle: 'Alerts and Notifications'
      }
    })
    .state('ui.nestable-lists', {
      url: "/nestable-lists",
      templateUrl: "app/views/pages/theme/ui-nestable-lists.html",
      data: {
        pageTitle: 'Nestable and Lists'
      }
    })
    .state('ui.panels', {
      url: "/panels",
      templateUrl: "app/views/pages/theme/ui-panels.html",
      data: {
        pageTitle: 'Panels'
      }
    })
    .state('ui.icons', {
      url: "/icons",
      templateUrl: "app/views/pages/theme/ui-icons.html",
      data: {
        pageTitle: 'Icons'
      }
    })
    .state('ui.typography', {
      url: "/typography",
      templateUrl: "app/views/pages/theme/ui-typography.html",
      data: {
        pageTitle: 'Typography'
      }
    })
    .state('forms', {
      abstract: true,
      url: "/forms",
      templateUrl: "app/views/pages/theme/common.html"
    })
    .state('forms.components', {
      url: "/components",
      templateUrl: "app/views/pages/theme/forms-components.html",
      data: {
        pageTitle: 'Components'
      }
    })
    .state('forms.validation', {
      url: "/validation",
      templateUrl: "app/views/pages/theme/forms-validation.html",
      data: {
        pageTitle: 'Validation'
      }
    })
    .state('forms.mask', {
      url: "/mask",
      templateUrl: "app/views/pages/theme/forms-mask.html",
      data: {
        pageTitle: 'Mask'
      }
    })
    .state('forms.wizard', {
      url: "/wizard",
      templateUrl: "app/views/pages/theme/forms-wizard.html",
      controller: wizardCtrl,
      data: {
        pageTitle: 'Wizard'
      }
    })
    .state('forms.wizard.step_one', {
      url: "/step_one",
      templateUrl: "app/views/pages/theme/wizard/step_one.html",
      data: {
        pageTitle: 'Wizard'
      }
    })
    .state('forms.wizard.step_two', {
      url: "/step_two",
      templateUrl: "app/views/pages/theme/wizard/step_two.html",
      data: {
        pageTitle: 'Wizard'
      }
    })
    .state('forms.wizard.step_three', {
      url: "/step_three",
      templateUrl: "app/views/pages/theme/wizard/step_three.html",
      data: {
        pageTitle: 'Wizard'
      }
    })
    .state('forms.multi-upload', {
      url: "/multi-upload",
      templateUrl: "app/views/pages/theme/forms-multi-upload.html",
      data: {
        pageTitle: 'Multiple File Upload'
      }
    })
    .state('forms.wysiwyg', {
      url: "/wysiwyg",
      templateUrl: "app/views/pages/theme/forms-wysiwyg.html",
      data: {
        pageTitle: 'WYSIWYG Editors'
      }
    })
    .state('tables', {
      abstract: true,
      url: "/tables",
      templateUrl: "app/views/pages/theme/common.html",
    })
    .state('tables.basic', {
      url: "/basic",
      templateUrl: "app/views/pages/theme/tables-basic.html",
      data: {
        pageTitle: 'Basic Table'
      }
    })
    .state('tables.data', {
      url: "/data",
      templateUrl: "app/views/pages/theme/tables-data.html",
      data: {
        pageTitle: 'Data Tables'
      }
    })
    .state('charts', {
      abstract: true,
      url: "/charts",
      templateUrl: "app/views/pages/theme/common.html",
    })
    .state('charts.chartjs', {
      url: "/chartjs",
      templateUrl: "app/views/pages/theme/charts-chartjs.html",
      data: {
        pageTitle: 'Chart.js'
      }
    })
    .state('charts.c3', {
      url: "/c3",
      templateUrl: "app/views/pages/theme/charts-c3.html",
      data: {
        pageTitle: 'C3 Charts'
      }
    })
    .state('charts.morris', {
      url: "/morris",
      templateUrl: "app/views/pages/theme/charts-morris.html",
      data: {
        pageTitle: 'Morris.js Charts'
      }
    })
    .state('charts.sparkline', {
      url: "/sparkline",
      templateUrl: "app/views/pages/theme/charts-sparkline.html",
      data: {
        pageTitle: 'Sparkline Charts'
      }
    })
    .state('mail', {
      abstract: true,
      url: "/mail",
      templateUrl: "app/views/pages/theme/common.html",
    })
    .state('mail.inbox', {
      url: "/inbox",
      templateUrl: "app/views/pages/theme/mail-inbox.html",
      data: {
        pageTitle: 'Mail Inbox'
      }
    })
    .state('mail.compose', {
      url: "/compose",
      templateUrl: "app/views/pages/theme/mail-compose.html",
      data: {
        pageTitle: 'Compose Mail'
      }
    })
    .state('maps', {
      abstract: true,
      url: "/maps",
      templateUrl: "app/views/pages/theme/common.html",
    })
    .state('maps.google', {
      url: "/google",
      templateUrl: "app/views/pages/theme/maps-google.html",
      data: {
        pageTitle: 'Google Maps'
      }
    })
    .state('maps.vector', {
      url: "/vector",
      templateUrl: "app/views/pages/theme/maps-vector.html",
      data: {
        pageTitle: 'Vector Maps'
      }
    })
    .state('pages', {
      abstract: true,
      url: "/pages",
      templateUrl: "app/views/pages/theme/common.html",
    })
    .state('pages.blank', {
      url: "/blank",
      templateUrl: "app/views/pages/theme/pages-blank.html",
      data: {
        pageTitle: 'Blank Page'
      }
    })
    .state('pages.profile', {
      url: "/profile",
      templateUrl: "app/views/pages/theme/pages-profile.html",
      data: {
        pageTitle: 'Profile'
      }
    })
    .state('animations', {
      url: "/animations",
      templateUrl: "app/views/pages/theme/animations.html",
      data: {
        pageTitle: 'Animations'
      }
    })


    // vault page
    .state('vault', {
      url: '/vault',
      templateUrl: 'app/views/pages/vault/vault.html',
      //controller: 'vaultController',
      //controllerAs: 'vault'

    })

    .state('vault.edit', {  // edit vault extra method by open html to edit
      url: '/vault/:vault_id',
      templateUrl: 'app/views/pages/vault/partial/vaultEdit.html',
      //controller: 'vaultEditCtrl',
      //controllerAs: 'vault'

    })

    .state('vaults.category', {  // when click on the menu to open associated page
      url: '/vaults/:vault_id',
      templateUrl: 'app/views/pages/vault/partial/vaultCategory.html',
      //controller: 'vaultController',
      //controllerAs: 'vault'

    })


}
angular
  .module('neuboard')
  .config(config)
  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
  });
