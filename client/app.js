angular.module('splus', [
  'angularMoment',
	'ui.bootstrap',
  'ui.router',
	'splus.apis',
	'splus.teams',
	'splus.search',
  'splus.badges',
	'splus.nav',
  'splus.datastore'
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
.run(function ($rootScope, $location) {
  $rootScope.$on("$locationChangeStart",function(event, next, current) {
    console.log('next == ', next, typeof next, next === 'http://localhost:3005/#/teams')
    if(next === 'http://localhost:3005/#/teams') {
      console.log('Activating Please Wait!')
      window.loading_screen = window.pleaseWait({
        logo: "/img/logo.png",
        backgroundColor: '#3380ff',
        loadingHtml: "<p class='loading-message'>Loading Match Data From Rito Games API</p><br><div class='sk-cube-grid'><div class='sk-cube sk-cube1'></div><div class='sk-cube sk-cube2'></div><div class='sk-cube sk-cube3'></div><div class='sk-cube sk-cube4'></div><div class='sk-cube sk-cube5'></div><div class='sk-cube sk-cube6'></div><div class='sk-cube sk-cube7'></div><div class='sk-cube sk-cube8'></div><div class='sk-cube sk-cube9'></div></div>"
      });
    }
  });
});