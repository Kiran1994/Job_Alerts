function route(pathname, handle, request, response)
{
    if(typeof handle[pathname] === "function")
    {
        handle[pathname](request, response);
    }
    else if(pathname.indexOf(".css") != -1)
    {
        handle["css_file_handler"](request, response);
    }
    else if(pathname.indexOf(".jpeg") != -1)
    {
        handle["jpeg_file_handler"](request, response);
    }
    else if(pathname.indexOf(".js") != -1)
    {
        handle["js_file_handler"](request, response);
    }
    else if(pathname.indexOf(".otf") != -1)
    {
        handle["otf_file_handler"](request, response);
    }
    else
    {
        handle["/page_not_found"](response);
    }
}

exports.route = route;
