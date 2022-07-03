const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");
const postData = require("./lib/postData.js");
const dataProcess = require("./lib/dataProcess.js");

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let query = url.parse(_url, true).query;
  // url info check
  let pathname = url.parse(_url, true).pathname;
  let path = url.parse(_url, true).path;
  let title = query.id;

  if (pathname === "/") {
    postData.getPostData(title, path, response);
  } else if (pathname === "/create") {
    postData.createPostData(title, response);
  } else if (pathname === "/create_process") {
    dataProcess.createProcess(request, qs, response);
  } else if (pathname === "/update") {
    dataProcess.updateView(query, template, response);
  } else if (pathname === "/update_process") {
    dataProcess.updateProcess(request, qs, response);
  } else if (pathname === "/delete_process") {
    dataProcess.deleteProcess(request, qs, response);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
