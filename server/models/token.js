var mongoDB = require("mongodb");

var mongoClient = mongoDB.MongoClient;
var url = "mongodb://localhost:27017/job_alerts";

function check_auth_token(auth_token, company_id_parameter, callback)
{
    mongoClient.connect(url, function(err, db)
    {
        if(err) throw err;

        token = db.collection("Token");
        token.find({_id : auth_token, company_id : company_id_parameter}).limit(1).toArray(function(err, item)
        {
            if(err) console.log(err.message);
            if(item.length === 1) callback(true);
            else callback(false);
        });
    });
}

exports.check_auth_token = check_auth_token;
