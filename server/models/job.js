var mongoDB = require("mongodb");
var token = require("../models/token.js");

var mongoClient = mongoDB.MongoClient;
var url = "mongodb://localhost:27017/job_alerts";

function find(designation, location, response)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err)
        {
            console.log(err.message);
            var response_json = {status: "failure", reason: "server failure"};
            send_ok_response(response, JSON.stringify(response_json), "text/plain");
        }
        else
        {
            var query = {};
            if(designation != "") query["designation"] = designation;
            if(location != "") query["location"] = location;

            jobs = db.collection("Job");
            jobs.find(query).toArray(function(err, item)
            {
                if(err)
                {
                    console.log(err.message);
                    var response_json = {status: "failure", reason: "server failure"};
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }
                else
                {
                    var response_json = {status: "success", company: [], designation: [], salary: [], location: []};
                    for(i = 0;i < item.length;i++)
                    {
                        response_json['company'].push(item[i]['company_id']);
                        response_json['designation'].push(item[i]['designation']);
                        response_json['salary'].push(item[i]['salary']);
                        response_json['location'].push(item[i]['location']);
                    }
                    console.log(JSON.stringify(response_json));
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }

                db.close();
            });
        }
    });
}

function post(request, response, postData)
{
    try
    {
        token.check_auth_token(request.headers['authorization'], request.headers['company_id'], function(valid)
        {
            if(valid === true)
            {
                mongoClient.connect(url, function(err, db)
                {
                    job = db.collection("Job");
                    job.insert({company_id: request.headers['company_id'], designation: postData['designation'], salary: postData['salary'], location: postData['location'], description: postData['description']}, function(err)
                    {
                        if(err)
                        {
                            console.log(err.message);
                            var response_json = {status: "failure", reason: "server failure"};
                            send_ok_response(response, JSON.stringify(response_json), "text/plain");
                        }
                        else
                        {
                            var response_json = {status : "success"};
                            send_ok_response(response, JSON.stringify(response_json), "text/plain");
                        }

                        db.close();
                    });
                });
            }
            else
            {
                var response_json = {status: "failure", reason: "requires user to be logged in"};
                send_ok_response(response, JSON.stringify(response_json), "text/plain");
            }
        });
    }
    catch(err)
    {
        console.log(err.message);
        send_internal_server_error(response);
    }
}

function send_internal_server_error(response)
{
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("Internal server error");
    response.end();
}

function send_ok_response(response, content, content_type)
{
    response.writeHead(200, {"Content-Type": content_type});
    response.write(content);
    response.end();
}

exports.find = find;
exports.post = post;
