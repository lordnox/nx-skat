angular.module('nx-skat').controller('skatCreateGameController', function($scope, $state, toaster, skatGames) {
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
});