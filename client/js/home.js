var home = angular.module('home', []);

home.controller('home_controller', function($scope, $http)
{
    $scope.search_designation = "";
    $scope.search_location = "";

    $scope.search = function()
    {
        $http(
        {
            method : "GET",
            url : "https://localhost:8080/search",
            headers : { 'designation' : $scope.search_designation , 'location' : $scope.search_location }
        })
        .success(function(data)
        {
            window.alert(data.status);
            document.getElementById("search_results").innerHTML = data;
            $compile( document.getElementById("search_results") )($scope);
        });
    }
});
