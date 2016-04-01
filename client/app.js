angular.module('splus', [
  'angularMoment',
	'ui.bootstrap',
  'ui.router',
	'splus.apis',
	'splus.teams',
	'splus.search',
  'splus.badges',
	'splus.nav'
])
.config(['$stateProvider', '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/search');

	$stateProvider.state('searchstate', {
    url: '/search',
    templateUrl: '/templates/gamesearch.html',
    controller: 'SearchController'
  })
  .state('teamstate', {
    url: '/teams',
    templateUrl: '/templates/matchview.html',
    controller: 'TeamController'
  });

}])