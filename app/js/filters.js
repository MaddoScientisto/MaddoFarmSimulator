'use strict';

/* Filters */

angular.module('harvestMaddoFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
}).filter('ayy', function() {
  return function(input) {
    return input ? '\u2713' + "cazzo" : '\u2718';
  };
});