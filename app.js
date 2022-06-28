const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const template = {
  HTML: (title, filelist, body, control) => {
    const list = template.list(filelist);
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    <ol>
    ${list}
    </ol>
    ${control}
    ${body}
    </body>
    </html>
    `;
  },
  list: (filelist) => {
    const list = filelist
      .map((file) => {
        return `<li><a href='/?id=${file}'>${file}</a></li>`;
      })
      .join("\n");
    return list;
  },
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
        const html = template.HTML(
          title,
          filelist,
          `<h2>${title ? title : "Welcome"}</h2> <p>${
            description ? description : "Hello, Node.js"
          }</p>`,
          path === "/"
            ? '<a href="/create">create</a>'
            : `
            <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      const title = "write article";
      const html = template.HTML(
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
      response.end(html);
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
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`./data/${query.id}`, "utf8", function (err, description) {
        const title = query.id;
        const html = template.HTML(
          title,
          filelist,
          `<h2>${title ? title : "Welcome"}</h2>
          <form action='/update_process' method='post'>
          <p><input type='hidden' name='id' value='${title}'></p>
          <p><input type='text' name='title' placeholder='title' value='${title}'></p>
          <p><textarea name='description' placeholder='description'>${description}</textarea></p>
          <p><input type='submit'></p>
          </form>`,
          ""
        );
        response.writeHead(200);
        response.end(html);
      });
    });
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
