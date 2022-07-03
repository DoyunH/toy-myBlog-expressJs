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
    dataProcess.updateProcess(query, template, response);
    // fs.readdir("./data", function (err, filelist) {
    //   fs.readFile(`./data/${query.id}`, "utf8", function (err, description) {
    //     const title = query.id;
    //     const html = template.HTML(
    //       title,
    //       filelist,
    //       `<h2>${title ? title : "Welcome"}</h2>
    //       <form action='/update_process' method='post'>
    //       <p><input type='hidden' name='id' value='${title}'></p>
    //       <p><input type='text' name='title' placeholder='title' value='${title}'></p>
    //       <p><textarea name='description' placeholder='description'>${description}</textarea></p>
    //       <p><input type='submit'></p>
    //       </form>`,
    //       ""
    //     );
    //     response.writeHead(200);
    //     response.end(html);
    //   });
    // });
  } else if (pathname === "/update_process") {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const title = post.title;
      const id = post.id;
      const description = post.description;

      // post file write
      fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
        fs.writeFile(`./data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const id = post.id;

      // post file write
      fs.unlink(`./data/${id}`, function (err) {
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
