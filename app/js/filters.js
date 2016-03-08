angular.module('marketFilters', []).filter('filter', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});
