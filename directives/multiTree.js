angular.module('cbTree', [])
    .directive('multiTree', function(){
        return {
            restrict: 'A',
            templateUrl: 'directives/multiTree.html',
            replace: true,
            scope: {
                multiTreeData: '=multiTreeData'
            },
            controller: function($scope){
                
            }
        };
    });