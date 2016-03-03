'use strict';

/* Filters */

angular.module('harvestMaddoFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});