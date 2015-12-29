var crypto = require("crypto");
var mongoDB = require("mongodb");

var mongoClient = mongoDB.MongoClient;
var url = "mongodb://localhost:27017/job_alerts";

function hash(string)
{
    sha_sum = crypto.createHash("sha256");
    sha_sum.update(string);

    return sha_sum.digest("hex");
}

function register(postData, response)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err) send_internal_server_error(response);
        else
        {
            company_name = postData["company_name"];
            email_id = postData["email_id"];
            password = hash(postData["password"]);

            company = db.collection("Company");
            company.insert({company_name : company_name, _id : email_id, password : password}, function(err)
            {
                if(err)
                {
                    console.log(err.message);
                    var response_json = {status: "failure", reason: "id already taken"};
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }
                else
                {
                    auth_token = crypto.randomBytes(256);
                    var response_json = {status : "success", auth_token: auth_token};
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }

                db.close();
            });
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
