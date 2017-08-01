angular.module('clApp',['ngAnimate', 'ngSanitize']);
angular.module('clApp')
    .controller('MainController',($scope,$http)=>{

        $scope.selectedCode="sss";
        $scope.searchterms="";
        $scope.results=[];
        $scope.locations=[];
        $scope.codes=[];
        $scope.showLocations=false;



        function performSearch(city){
            debugger;
        }
        $scope.doSearch=function(){
            for(var location in $scope.locations){
                for(var city in location.cities){
                    if(city.selected){
                        debugger;
                        performSearch(city);
                    }
                }
            }
            $http.get('/search/'+$scope.searchterms)
                .then(res=>{
                    debugger;
                })
                .catch(err=>{
                    debugger;
                })
            console.log($scope.searchterms);
        }
        $scope.changeStatus=function(checked){
            for(var location of $scope.locations){
                for(var city of location.cities){
                    city.selected=checked;
                }
            }
        }
        console.log('starting');

        $http.get('/codes')
            .then(res=>{
                $scope.codes=res.data;
            })
            .catch(err=>{
                alert(err)
            });

        $http.get('/cities')
            .then(res=>{
                $scope.locations=res.data;

            })
            .catch(err=>{
debugger;
            })
    
    })