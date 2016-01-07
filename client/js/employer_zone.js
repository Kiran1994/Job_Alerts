var employer_zone = angular.module('employer_zone', []);

employer_zone.controller('employer_zone_controller', function($scope, $http, $window, $compile)
{
    $scope.login_form_data = "";
    $scope.reg_form_data = {};
    $scope.auth_token = "";
    $scope.company_id = "";
    $scope.login_error_reason = "";
    $scope.login_success_message = "";
    $scope.post_job_form_data = "";
    $scope.post_job_success_message = "";
    $scope.post_job_error_reason = "";
    $scope.reg_error_reason = "";
    $scope.reg_success_message = "";

    $scope.load_employer_home = function()
    {
        if($scope.auth_token != "")
        {
            $http(
            {
                method : "GET",
                url : "https://localhost:8080/employer_zone_logged_in",
                headers : { 'Authorization' : $scope.auth_token , 'company_id' : $scope.company_id }
            })
            .success(function(data)
            {
                document.getElementById("page").innerHTML = data;
                $compile( document.getElementById("page") )($scope);
                document.getElementById("page").style.backgroundImage = "none";
            });
        }
        else
        {
            $http(
            {
                method : "GET",
                url : "https://localhost:8080/employer_zone_logged_out",
            })
            .success(function(data)
            {
                document.getElementById("page").innerHTML = data;
                $compile( document.getElementById("page") )($scope);
                document.getElementById("page").style.backgroundImage = "url('waves.jpeg')";
            });
        }
    };

    $scope.login = function()
    {
        $http(
        {
            method : "POST",
            url : "https://localhost:8080/company_login",
            data : $.param($scope.login_form_data),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data)
        {
            if(data.status == "success")
            {
                $scope.auth_token = data.auth_token;
                $scope.company_id = data.company_id;
                $scope.login_success_message = "Login successful";
                $scope.login_error_reason = "";
                $scope.load_employer_home();
            }
            else
            {
                $scope.login_error_reason = "Login failed: " + data.reason;
                $scope.login_success_message = "";
            }
        });
    }

    $scope.post_job = function()
    {
        $http(
        {
            method : "POST",
            url : "https://localhost:8080/post_job",
            data : $.param($scope.post_job_form_data),
            headers : { 'Authorization' : $scope.auth_token , 'company_id' : $scope.company_id, 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(data)
        {
            if(data.status == "success")
            {
                $scope.post_job_success_message = "Job successfully posted";
                $scope.post_job_error_reason = "";
            }
            else
            {
                $scope.post_job_success_message = "";
                $scope.post_job_error_reason = data.reason;
            }
        });
    }

    $scope.register = function()
    {
        $http(
        {
            method : "POST",
            url : "https://localhost:8080/company_reg",
            data : $.param($scope.reg_form_data),
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .success(function(data)
        {
            if(data.status == "success")
            {
                $scope.auth_token = data.auth_token;
                $scope.company_id = data.company_id;
                $scope.reg_success_message = "Registration successful";
                $scope.reg_error_reason = "";
                $scope.load_employer_home();
            }
            else
            {
                $scope.reg_error_reason = "Registration failed: " + data.reason;
                $scope.reg_success_message = "";
            }
        });
    };

    $scope.load_employer_home();
});
