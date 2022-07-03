const fs = require("fs");
const path = require("path");

module.exports = {
  createProcess: (request, qs, response) => {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;

      fs.writeFile(`./data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  },
  updateView: (query, template, response) => {
    fs.readdir("./data", function (err, filelist) {
      const filteredPath = path.parse(query.id).base;
      fs.readFile(
        `./data/${filteredPath}`,
        "utf8",
        function (err, description) {
          const title = query.id;
          const list = template.list(filelist);
          const html = template.HTML(
            title,
            list,
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
        }
      );
    });
  },
  updateProcess: (request, qs, response) => {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const title = post.title;
      const id = post.id;
      const description = post.description;

      fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
        fs.writeFile(`./data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });
    });
  },
  deleteProcess: (request, qs, response) => {
    let body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      const post = qs.parse(body);
      const id = post.id;
      const filterdPath = path.parse(id).base;

      fs.unlink(`./data/${filterdPath}`, function (err) {
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  },
};
