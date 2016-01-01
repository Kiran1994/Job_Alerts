var server = require("./server");
var router = require("./router");
var requestHandler = require("./requestHandler");

var handle = {};
handle["/"] = requestHandler.index;
handle["/company_login"] = requestHandler.company_login;
handle["/company_reg"] = requestHandler.company_reg;
handle["css_file_handler"] = requestHandler.css_file_handler;
handle["/employer_zone"] = requestHandler.employer_zone;
handle["/employer_zone_logged_in"] = requestHandler.employer_zone_logged_in;
handle["/employer_zone_logged_out"] = requestHandler.employer_zone_logged_out;
handle["/index"] = requestHandler.index;
handle["jpeg_file_handler"] = requestHandler.jpeg_file_handler;
handle["js_file_handler"] = requestHandler.js_file_handler;
handle["otf_file_handler"] = requestHandler.otf_file_handler;
handle["/page_not_found"] = requestHandler.page_not_found;

server.start(router.route, handle);
