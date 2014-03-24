angular.module('nx-skat', [
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


