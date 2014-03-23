angular.module('templates', [])
  .provider('tpl', function() {

    var templatePath      = ['scripts', 'modules'];
    var templateDirectory = 'templates';

    var templateLocator = function(module) {
      var templateBase = templatePath.concat([module]).concat([templateDirectory]);
      return function(/* path, path */) {
        return templateBase.concat(Array.prototype.slice.call(arguments)).join('/') + '.html';
      };
    };

    // recurse itself to be a provider for other providers... kind of hacky
    templateLocator.$get = templateLocator;

    return templateLocator;
  })
;
;angular.module('nx-skat', [
  'ui.router'
, 'templates'
, 'toaster'
])

  .config(function ($stateProvider, tplProvider) {

    var template = tplProvider('nx-skat');

    /**
     *    Define an abstract state that itself defines the navigation element and a container for the
     *    sub-states
     **/
    $stateProvider
      .state('skat', {
        abstract: true
      , views: {
          '@': {
            templateUrl: template('layout')
          }
        , 'navigation': {
            templateUrl: template('navigation')
          }
        }
      })
      .state('skat.lobby', {
        url: '/'
      , templateUrl: template('gamesList')
      , controller: 'skatOpenGamesController'
      , description: 'Lists all currently open / joinable games'
      })
      .state('skat.active', {
        url: '/active'
      , templateUrl: template('gamesList')
      , controller: 'skatActiveGamesController'
      , description: 'Lists all currentyl joined games'
      })
      .state('skat.profile', {
        url: '/profile'
      , templateUrl: template('profile')
      , controller: 'skatProfileController'
      , description: 'Show / Edit your profile'
      })

      .state('skat.game', {
        abstract: true
      , url: '/game'
      , templateUrl: template('game')
      , description: 'Show one game'
      })

      .state('skat.game.create', {
        url: '/create'
      , templateUrl: template('gameCreate')
      , controller: 'skatCreateGameController'
      , description: 'Create a new instance of the game'
      })
    ;
  })

;


;angular.module('nx-skat').controller('skatActiveGamesController', function() {

});;angular.module('nx-skat').controller('skatCreateGameController', function($scope, $state, toaster, skatGames) {
  $scope.game = {
    name: 'My Game'
  };

  $scope.createGame = function(game) {
    // send a request to the server and switch the view to the game's lobby
    toaster.pop('success', 'create..', 'creating game');
    skatGames.create(game).then(function(game) {
      $state.go('skat.game.lobby', game.id);
    });
  };
});;angular.module('nx-skat').controller('skatOpenGamesController', function() {

});;angular.module('nx-skat').controller('skatProfileController', function() {

});;angular.module('nx-skat').provider('skatGames', function() {
  var provider = function($q, $timeout) {
    var createGame = function(game) {
      var defer = $q.defer();

      $timeout(function() {
        var result  = angular.copy(game);
        result.id   = 100;
        defer.resolve(result);
      }, 1000);

      return defer.promise;
    };

    return {
      create: createGame
    };
  };
  return {
    $get: provider
  };
});;
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