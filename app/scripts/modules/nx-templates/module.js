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
