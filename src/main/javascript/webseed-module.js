var seed = angular.module('seedApp', [ 'ngSanitize', 'ui.select' ]);

seed.controller('seedController', [ '$scope', function($scope) {

	$scope.people = [ {
		"id" : 1,
		"name" : "Axel"
	}, {
		"id" : 2,
		"name" : "Mr. Foo"
	}, {
		"id" : 3,
		"name" : "Ms. Bar"
	} ];
	$scope.person = {};
	$scope.refreshNames = function(search) {
		$scope.people = $scope.people.filter(function(p) {
							return $scope.contains(p.name, search);
						});
	}

	$scope.contains = function(orig, find) {
		return orig.toUpperCase().indexOf(find.toUpperCase()) > -1;
	};

} ]);