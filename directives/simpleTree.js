angular.module('cbTree', [])
    .directive('simpleTree', function(){
        return {
            restrict: 'A',
            templateUrl: 'directives/simpleTree.html',
            replace: true,
            scope: {
                treeData: '=treeData',
                haveOperationBtn: '=haveOperationBtn',
                haveCheckBox: '=haveCheckBox',
                haveAllChecked: '=haveAllChecked',
                allChecked: '=allChecked',
                addNode: '&addNode',
                editNode: '&editNode',
                deleteNode: '&deleteNode'
            },
            controller: function($scope){
                
                if($scope.haveOperationBtn){
                    $scope.contentContainerStyle = {'width': '91%'};
                }else{
                    $scope.contentContainerStyle = {'width': '100%'};
                }

                $scope.toggleExpandState = function(node){
                    node.state.expand = !node.state.expand;
                    angular.forEach(node.childNodeIds, function(childNodeId, childNodeIdIndex){
                        for(var i = 0; i < $scope.treeData.length; i++){
                            if(childNodeId === $scope.treeData[i].id){
                                $scope.treeData[i].state.display = node.state.expand;
                                break;
                            }
                        }
                    });
                };

                $scope.toggleAllChecked = function(){
                    $scope.allChecked = !$scope.allChecked;
                    angular.forEach($scope.treeData, function(node, nodeIndex){
                        node.state.checked = $scope.allChecked;
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

                $scope.toAddNode = function(originalNode){
                    $scope.addNode()(originalNode);
                };

                $scope.toEditNode = function(originalNode){
                    $scope.editNode()(originalNode);
                };

                $scope.toDeleteNode = function(originalNode){
                    $scope.deleteNode()(originalNode);
                };

                syncAllCheckedModel = function(){
                    var shouldChecked = true;
                    for(var i = 0; i < $scope.treeData.length; i++){
                        if(!$scope.treeData[i].state.checked){
                            shouldChecked = false;
                            break;
                        }
                    }
                    $scope.allChecked = shouldChecked;
                }

                syncParentNodeCheckedState = function(node){
                    var parentNode;

                    if(node.parentId === -9999){
                        return;
                    }

                    if(node.state.checked){
                        for(var i = 0; i < $scope.treeData.length; i++){
                            if ($scope.treeData[i].id === node.parentId) {
                                parentNode = $scope.treeData[i];
                                parentNode.state.checked = true;
                                break;
                            }
                        }
                    }else{
                        for(var i = 0; i < $scope.treeData.length; i++){
                            if ($scope.treeData[i].id === node.parentId) {
                                parentNode = $scope.treeData[i];
                                var shouldChecked = false;
                                for(var j = 0; j < parentNode.childNodeIds.length; j++){
                                    for(var k = 0; k < $scope.treeData.length; k++){
                                        if($scope.treeData[k].id === parentNode.childNodeIds[j] && $scope.treeData[k].state.checked){
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
                };

                syncChildNodesCheckedState = function(node){
                    angular.forEach(node.childNodeIds, function(childNodeId, childNodeIdIndex){
                        for(var i = 0; i < $scope.treeData.length; i++){
                            if(childNodeId === $scope.treeData[i].id){
                                $scope.treeData[i].state.checked = node.state.checked;
                                syncChildNodesCheckedState($scope.treeData[i]);
                                break;
                            }
                        }
                    });
                };
            }
        };
    });