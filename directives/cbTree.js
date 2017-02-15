angular.module('cbTree', [])
    .directive('simpleTree', function(){
        return {
            restrict: 'A',
            templateUrl: 'directives/simpleTree.html',
            replace: true,
            scope: {
                simpleTree: '=simpleTree'
            },
            controller: function($scope){
                
                if($scope.simpleTree.haveOperationBtn){
                    $scope.simpleTree.contentContainerStyle = {'width': '91%'};
                }else{
                    $scope.simpleTree.contentContainerStyle = {'width': '100%'};
                }

                $scope.toggleExpandState = function(node){
                    node.state.expand = !node.state.expand;
                    angular.forEach(node.childNodeIds, function(childNodeId, childNodeIdIndex){
                        for(var i = 0; i < $scope.simpleTree.treeNodes.length; i++){
                            if(childNodeId === $scope.simpleTree.treeNodes[i].id){
                                $scope.simpleTree.treeNodes[i].state.display = node.state.expand;
                                break;
                            }
                        }
                    });
                };

                $scope.toggleAllChecked = function(){
                    $scope.simpleTree.allChecked = !$scope.simpleTree.allChecked;
                    angular.forEach($scope.simpleTree.treeNodes, function(node, nodeIndex){
                        node.state.checked = $scope.simpleTree.allChecked;
                    });
                };

                $scope.toggleCheckedState = function(node){
                    node.state.checked = !node.state.checked;
                    syncChildNodesCheckedState(node);
                    syncParentNodeCheckedState(node);
                    syncAllCheckedModel();
                };

                $scope.showOperateBtn = function(node){
                    node.state.operationBtnDisplay = true;
                };

                $scope.hideOperateBtn = function(node){
                    node.state.operationBtnDisplay = false;
                };

                function syncAllCheckedModel(){
                    var shouldChecked = true;
                    for(var i = 0; i < $scope.simpleTree.treeNodes.length; i++){
                        if(!$scope.simpleTree.treeNodes[i].state.checked){
                            shouldChecked = false;
                            break;
                        }
                    }
                    $scope.simpleTree.allChecked = shouldChecked;
                }

                function syncParentNodeCheckedState(node){
                    var parentNode;

                    if(node.parentId === -9999){
                        return;
                    }

                    if(node.state.checked){
                        for(var i = 0; i < $scope.simpleTree.treeNodes.length; i++){
                            if ($scope.simpleTree.treeNodes[i].id === node.parentId) {
                                parentNode = $scope.simpleTree.treeNodes[i];
                                parentNode.state.checked = true;
                                break;
                            }
                        }
                    }else{
                        for(var i = 0; i < $scope.simpleTree.treeNodes.length; i++){
                            if ($scope.simpleTree.treeNodes[i].id === node.parentId) {
                                parentNode = $scope.simpleTree.treeNodes[i];
                                var shouldChecked = false;
                                for(var j = 0; j < parentNode.childNodeIds.length; j++){
                                    for(var k = 0; k < $scope.simpleTree.treeNodes.length; k++){
                                        if($scope.simpleTree.treeNodes[k].id === parentNode.childNodeIds[j] && $scope.simpleTree.treeNodes[k].state.checked){
                                            shouldChecked = true;
                                            break;
                                        }
                                    }
                                    if(shouldChecked){
                                        break;
                                    }
                                }
                                parentNode.state.checked = shouldChecked;
                                break;
                            }
                        }
                    }
                    syncParentNodeCheckedState(parentNode);
                }

                function syncChildNodesCheckedState(node){
                    angular.forEach(node.childNodeIds, function(childNodeId, childNodeIdIndex){
                        for(var i = 0; i < $scope.simpleTree.treeNodes.length; i++){
                            if(childNodeId === $scope.simpleTree.treeNodes[i].id){
                                $scope.simpleTree.treeNodes[i].state.checked = node.state.checked;
                                syncChildNodesCheckedState($scope.simpleTree.treeNodes[i]);
                                break;
                            }
                        }
                    });
                };
            }
        };
    })
    .directive('multiTree', function(){
        return {
            restrict: 'A',
            template: '<div ng-repeat="simpleTree in multiTree track by $index" simple-tree="simpleTree"></div>',
            replace: true,
            scope: {
                multiTree: '=multiTree'
            },
            controller: function($scope){
                
            }
        };
    });