const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const templateHTML = (title, filelist, body, control) => {
  const list = templateListMaker(filelist);

  return `
    <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title ? title : "Welcome"}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB2</a></h1>
        <ol>
          ${list}
        </ol>
        ${control}
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
  return list;
};

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let query = url.parse(_url, true).query;
  // url info check
  let pathname = url.parse(_url, true).pathname;
  let path = url.parse(_url, true).path;
  let title = query.id;

  if (pathname === "/") {
    console.log(url.parse(_url, true));
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`./data/${query.id}`, "utf8", function (err, description) {
        const template = templateHTML(
          title,
          filelist,
          `<h2>${title ? title : "Welcome"}</h2> <p>${
            description ? description : "Hello, Node.js"
          }</p>`,
          path === "/"
            ? '<a href="/create">create</a>'
            : `<a href="/create">create</a><br><a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      const title = "write article";
      const template = templateHTML(
        title,
        filelist,
        `<h2>${title}</h2>
        <form action='/create_process' method='post'>
        <p><input type='text' name='title' placeholder='title'></p>
        <p><textarea name='description' placeholder='description'></textarea></p>
        <p><input type='submit'></p>
        </form>`,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;

      // post file write
      fs.writeFile(`./data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
