var fs = require("fs");

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

function send_ok_response(response, content, content_type)
{
    response.writeHead(200, {"Content-Type": content_type});
    response.write(content);
    response.end();
}

exports.css_file_handler = css_file_handler;
exports.employer_zone = employer_zone;
exports.index = index;
exports.jpeg_file_handler = jpeg_file_handler;
exports.js_file_handler = js_file_handler;
exports.otf_file_handler = otf_file_handler;
exports.page_not_found = page_not_found;
