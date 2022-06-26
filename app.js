const http = require("http");
const fs = require("fs");
const url = require("url");

const templateHTML = (title, filelist, body) => {
  const list = templateListMaker(filelist);

  return `
    <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title ? title : "Welcome"}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          ${list}
        </ol>
        ${body}
      </body>
      </html>
    `;
};

const templateListMaker = (filelist) => {
  const list = filelist
    .map((file) => {
      return `<li><a href='/?id=${file}'>${file}</a></li>`;
    })
    .join("\n");
  console.log("filelist :", filelist);
  return list;
};

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let query = url.parse(_url, true).query;
  // url info check
  let pathname = url.parse(_url, true).pathname;
  let title = query.id;

  if (pathname === "/") {
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`./data/${query.id}`, "utf8", function (err, description) {
        const template = templateHTML(
          title,
          filelist,
          `<h2>${title ? title : "Welcome"}</h2>
        <p>${description ? description : "Hello, Node.js"}</p>`
        );
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
