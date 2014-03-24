angular.module('nx-skat').provider('skatGames', function() {
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
});