MainCtrl.$inject = ['$scope', '$http'];

function MainCtrl($scope, $http) {
  $scope.name = 'world';
  $scope.data;

  $http.get('/api')
      .success(function(x){
        $scope.data = x;
      })
      .error(function(error){
        console.log(error);
      });
}

export default MainCtrl;
