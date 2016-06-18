MainCtrl.$inject = ['$scope', '$http'];

function MainCtrl($scope, $http) {
  $scope.name = 'world';
  $scope.data = '';

  $http.get('/api')
      .success(function(x){
        'use strict';
        $scope.data = x;
      })
      .error(function(error){
        'use strict';
        console.log(error);
      });
}

export default MainCtrl;
