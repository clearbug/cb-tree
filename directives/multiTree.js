angular.module('cbTree', [])
    .directive('multiTree', function(){
        return {
            restrict: 'A',
            templateUrl: 'directives/multiTree.html',
            replace: true,
            scope: {
                multiTree: '=multiTree'
            },
            controller: function($scope){
                console.log($scope.multiTree);
            }
        };
    });