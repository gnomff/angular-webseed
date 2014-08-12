var seed = angular.module('seedApp',['ui.bootstrap', 'ui.select2', 'nameService']);
  
seed.controller('seedController', ['$scope', 'NameService', function($scope, NameService) {
	
	$scope.names = [{"id":1,"name":"Axel"},{"id":2,"name":"Mr. Foo"},{"id":3,"name":"Ms. Bar"}];
	
	$scope.contains = function(orig, find){
    	return orig.toUpperCase().indexOf(find.toUpperCase()) > -1;
    };
	
	$scope.selectName = function(){
        return {
            multiple: false,
            simple_tags: false,
            placeholder: "Select a Name...",
            allowClear: true,
            query: function (query) {
            	query.callback({
                    results: $scope.names.filter(
                    		function(n){return $scope.contains(n.name, query.term);})
                    		.map(function(n){return {id:n.id, text:n.name};})
                });
            	
                
            }
        };
    };
}]);