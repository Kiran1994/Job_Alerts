var company = require("./models/company.js");
var token = require("./models/token.js");
var fs = require("fs");
var qs = require("querystring");
var url = require("url");

function company_login(request, response)
{
    if(request.method != "POST") method_not_allowed(response);
    else
    {
        var body = "";

        request.on("data", function(data)
        {
            body += data;
            if(body.length > 1e6) request.connection.destroy();
        });

        request.on("end", function()
        {
            var postData = qs.parse(body);
            company.login(postData, response);
        });
    }
}

function company_reg(request, response)
{
    if(request.method != "POST") method_not_allowed(response);
    else
    {
        var body = "";

        request.on("data", function(data)
        {
            body += data;
            if(body.length > 1e6) request.connection.destroy();
        });

        request.on("end", function()
        {
            var postData = qs.parse(body);
            company.register(postData, response);
        });
    }
}

function css_file_handler(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        css = get_file_content("../client/css" + request.url);
        if(typeof css == "undefined") page_not_found(response);
        else send_ok_response(response, css, "text/css");
    }
}

function get_file_content(file_name)
{
    try
    {
        content = fs.readFileSync(file_name);
        return content;
    }
    catch(err)
    {
        console.log("Error: " + err.message);
        return;
    }
}

function employer_zone(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        html = get_file_content("../client/employer_zone.html");
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, html, "text/html");
    }
}

function employer_zone_logged_in(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        try
        {
            token.check_auth_token(request.headers['authorization'], request.headers['company_id'], function(valid)
            {
                if(valid === true)
                {
                    html = get_file_content("../client/employer_zone_logged_in.html");
                    if(typeof html == "undefined") page_not_found(response);
                    else send_ok_response(response, html, "text/html");
                }
                else
                {
                    employer_zone_logged_out(request, response);
                }
            });
        }
        catch(err)
        {
            console.log(err.message);
            send_internal_server_error(response);
        }
    }
}

function employer_zone_logged_out(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        html = get_file_content("../client/employer_zone_logged_out.html");
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, html, "text/html");
    }
}

function index(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        html = get_file_content("../client/index.html");
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, html, "text/html");
    }
}

function jpeg_file_handler(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        jpeg = get_file_content("../client/css/img" + request.url);
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, jpeg, "image/jpeg");
    }
}

function js_file_handler(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        js = get_file_content("../client/js" + request.url);
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, js, "text/html");
    }
}

function method_not_allowed(response)
{
    response.writeHead(405, {"Content-Type": "text/plain"});
    response.write("Method not allowed");
    response.end();
}

function otf_file_handler(request, response)
{
    if(request.method != "GET") method_not_allowed(response);
    else
    {
        otf = get_file_content("../client/css" + request.url);
        if(typeof html == "undefined") page_not_found(response);
        else send_ok_response(response, otf, "text/html");
    }
}

function page_not_found(response)
{
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Page not found");
    response.end();
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

exports.company_login = company_login;
exports.company_reg = company_reg;
exports.css_file_handler = css_file_handler;
exports.employer_zone = employer_zone;
exports.employer_zone_logged_in = employer_zone_logged_in;
exports.employer_zone_logged_out = employer_zone_logged_out;
exports.index = index;
exports.jpeg_file_handler = jpeg_file_handler;
exports.js_file_handler = js_file_handler;
exports.otf_file_handler = otf_file_handler;
exports.page_not_found = page_not_found;
