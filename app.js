const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let query = url.parse(_url, true).query;
  // url info check
  let pathname = url.parse(_url, true).pathname;
  let title = query.id;

  if (pathname === "/") {
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`./data/${query.id}`, "utf8", function (err, description) {
        const template = `
      <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title ? title : "Welcome"}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <ol>
            ${
              filelist &&
              filelist.map(
                function (file) {
                  return `<li><a href='/?id=${file}'>${file}</a></li>`;
                }.join("\n")
              )
            }
          </ol>
          <h2>${title ? title : "Welcome"}</h2>
          <p>${description ? description : "Hello, Node.js"}</p>
        </body>
        </html>
      `;
        response.writeHead(200);
        response.end(template);
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
