var crypto = require("crypto");
var mongoDB = require("mongodb");

var mongoClient = mongoDB.MongoClient;
var url = "mongodb://localhost:27017/job_alerts";

function generate_and_send_auth_token(postData, response)
{
    mongoClient.connect(url, function(err, db)
    {
        auth_token = crypto.randomBytes(256).toString('hex');
        token = db.collection("Token");
        token.insert({_id : auth_token, company_id : postData["email_id"], createdAt : new Date()}, function(err) //The token is set to expire 3 mins after 'createdAt'
        {
            if(err)
            {
                console.log(err.message);
                var response_json = {status: "failure", reason: "failed to generate auth token"};
                send_ok_response(response, JSON.stringify(response_json), "text/plain");
            }
            else
            {
                var response_json = {status : "success", auth_token: auth_token, company_id: postData["email_id"]};
                console.log(JSON.stringify(response_json));
                send_ok_response(response, JSON.stringify(response_json), "text/plain");
            }

            db.close();
        });
    });
}

function hash(string)
{
    str = "";
    i = 0;
    while(i < 1000)
    {
        string += str;
        sha_sum = crypto.createHash("sha256");
        sha_sum.update(string);
        str = sha_sum.digest("hex");

        i++;
    }

    return str;
}

function login(postData, response)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err) throw err;

        company = db.collection("Company");
        company.find({_id : postData['email_id'], password : hash(postData['password'])}).limit(1).toArray(function(err, item)
        {
            if(err) console.log(err.message);
            else
            {
                if(item.length === 1) generate_and_send_auth_token(postData, response);
                else
                {
                    var response_json = {status: "failure", reason: "email id/password incorrect"};
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }
            }

            db.close();
        });
    });
}

function register(postData, response)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err) send_internal_server_error(response);
        else
        {
            company = db.collection("Company");
            company.insert({company_name : postData["company_name"], _id : postData["email_id"], password : hash(postData["password"])}, function(err)
            {
                if(err)
                {
                    console.log(err.message);
                    var response_json = {status: "failure", reason: "email id taken"};
                    send_ok_response(response, JSON.stringify(response_json), "text/plain");
                }
                else
                {
                    generate_and_send_auth_token(postData, response);
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
    console.log(content);
    response.write(content);
    response.end();
}

exports.login = login;
exports.register = register;
