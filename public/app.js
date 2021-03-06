angular.module("clApp", ["ngAnimate", "ngSanitize", "ngCookies"]);
angular
  .module("clApp")
  .directive("optionPanel", OptionPanel)
  .controller("MainController", MainController);

MainController.$inject = ["$scope", "$http", "$cookies",'$sce'];
OptionController.$inject = ["$scope", "$http", "$cookies"];

function MainController($scope, $http, $cookies,$sce) {
  $scope.url = "";
  $scope.searchterms='';
  $scope.locations = [];
  $scope.results=[];
  $scope.searchparams={
      code:'sss',
      search:''
  };

  $scope.hoverOut=function(){

  }
  $scope.hoverImage=function(){

  }

  $scope.getLargeImage=function(){
    debugger;
    var result =  $sce.trustAsHtml(`<img src=\"https://images.craigslist.org/${this.img}_300x300.jpg"></img>`);
    return result;
  }
  $http
    .get("/cities")
    .then(res => {
      $scope.locations = res.data;
    })
    .catch(err => {
      debugger;
    });
  $scope.$on('search',function(event,data){
    $scope.searchparams.search=data;
  });

  $scope.$on('category',function(event,data){
      console.log('category changed: ' + $scope.searchparams.code);
      $scope.searchparams.code=data;
  })

  function performSearch(city) {
    var code = $scope.searchparams.code;
    var params=$scope.searchparams.search;
    console.log($scope.searchparams);
    var data={
        city:'detroit',
        code:code,
        query:params
    };
    var url = `https://detroit.craigslist.org/search/${code}?query=${$scope.searchterms}`;
    if(params!=null&&params.length>0)
        url+=params;
    $http
      .get(`/find/${$scope.searchterms}/${data.city}/${$scope.searchparams.code}/${$scope.searchparams.search}`)
      .then(result => {
        for(var r of result.data)
          $scope.results.push(r);
      })
      .catch(err => {
        debugger;
      });
  }

  $scope.doSearch = function() {

    if (event.key != "Enter") return;
    $scope.results=[];
    var type = $scope.selectedCode.code;

    var options = "";

    var options = "";

    for (var location of $scope.locations) {
      for (var city of location.cities) {
        if (city.selected) {
          performSearch(city);
        }
      }
    }
  
  };
}

function OptionController($scope, $http, $cookies) {
      $scope.selectedCode = {};
  $scope.searchterms = "";
  $scope.results = [];
  $scope.locations = [];
  $scope.codes = [];

  $scope.showLocations = false;

  $scope.$emit("controllers", "controllers emit");

  $scope.changeStatus = function(checked) {
    for (var location of $scope.locations) {
      for (var city of location.cities) {
        city.selected = checked;
      }
    }
  };

  $http
    .get("/codes")
    .then(res => {
      $scope.codes = res.data;
      $scope.selectedCode = $scope.codes[0];
    })
    .catch(err => {
      alert(err);
    });


  $scope.changeValue = (op) => {

    $scope.search='';
    $scope.selectedCode.options
    .filter(code=>code.value)
    .forEach(code=>{
        switch(code.name){
            case "srchType":
                $scope.search+='&srchType=T';
             break;
             case 'postedToday':
             case 'hasPic':
             case 'bundleDuplicates':
                $scope.search+=`&${code.name}=1`;
                break;
                case'min_price':
                case 'max_price':
                $scope.search+=`&${code.name}=${code.value}`;
                break;


             default:
             debugger;
             break;

        }
    });
    $scope.$emit('search',$scope.search);
  };



  $scope.changeCode = function() {
    $scope.$emit('category',$scope.selectedCode.code);

  };
}

function OptionPanel() {
  console.log("optionpanel");
  return {
    restrict: "AE",
    controller: OptionController,
    templateUrl: "./optionPanel.html"
  };
}
