var fs = require("fs");
var https = require("https");
var url = require("url");

function start(route, handle)
{
    var options = {key: fs.readFileSync('/etc/ssl/self-signed/server/privatekey.pem'), cert: fs.readFileSync('/etc/ssl/self-signed/server/certificate.pem')};

    function onRequest(request, response)
    {
        pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received");
        route(pathname, handle, request, response);
    }

    https.createServer(options, onRequest).listen(8080);
    console.log("Server started");
}

exports.start = start;
