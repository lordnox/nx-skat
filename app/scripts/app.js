
angular.module('application', [
    'ui.router',
    'nx-skat',
    'toaster'
  ])

  .config(function($locationProvider, $urlRouterProvider) {

    // Default route:
    $urlRouterProvider.otherwise('/');

    if( /*config.routing.html5Mode*/ false) {
      $locationProvider.html5Mode(true);
    }
    else {
      $locationProvider.html5Mode(false);
      var routingPrefix = '';
      if(routingPrefix && routingPrefix.length > 0) {
        $locationProvider.hashPrefix(routingPrefix);
      }
    }
  })

  .run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  })

  .controller('appCtrl', function($scope) {
    $scope.title = 'Raynode - nx-skat - Skat Game Frontent';
  })
;