var mongoDB = require('mongodb');

var mongoClient = mongoDB.MongoClient;
var url = "mongodb://localhost:27017/job_alerts";

function register(postData, response)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err) send_internal_server_error(response);
        else
        {
            company = db.collection("Company");
            company.insert(postData);
            db.close();

            send_ok_response(response, "status:success", "text/plain");
        }
    });
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

exports.register = register;
