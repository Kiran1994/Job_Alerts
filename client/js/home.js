var home = angular.module('home', []);

home.controller('home_controller', function($scope, $http)
{
    $scope.search_designation = "";
    $scope.search_location = "";

    $scope.get_job_details = function(job_data, index, callback)
    {
        $http(
        {
            method : "GET",
            url : "https://localhost:8080/get_company_name",
            headers : {'company_id' : job_data.company[index]}
        })
        .success(function(data)
        {
            callback(job_data.company[index], data.company_name, job_data.designation[index], job_data.salary[index], job_data.location[index]);
        });
    }

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
            var html = "";
            for(i = 0;i < data.designation.length;i++)
            {
                $scope.get_job_details(data, i, function(company_id, company_name, designation, salary, location)
                {
                    html += "<div class = 'col-2 result'><img style = 'padding: 10px; border: 1px solid #e4f1fe' height = 25% width = 100% src = '" + company_id + ".jpeg'></img>";
                    html += "<div style = 'margin-top: 5%'>" + company_name + "</div>";
                    html += "<div>" + designation + "</div>";
                    html += "<div>Rs " + salary + "pa</div>";
                    html += "<div>" + location + "</div></div>";
                    document.getElementById("search_results").innerHTML = html;
                    $compile( document.getElementById("search_results") )($scope);
                });
            }
        });
    }

    $scope.search();
});
