angular.module('marketFilters', []).filter('whatIsThat', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
