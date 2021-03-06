const fs = require("fs");
const template = require("./template.js");
const sanitizeHtml = require("sanitize-html");

module.exports = {
  getPostData: (title, path, response) => {
    fs.readdir("./data", function (err, filelist) {
      // filterd path
      const path = require("path");
      const filteredPath = path.parse(title || "/").base;

      fs.readFile(
        `./data/${filteredPath}`,
        "utf8",
        function (err, description) {
          const list = template.list(filelist);
          const sanitizedTitle = sanitizeHtml(title);
          const sanitizedDescription = sanitizeHtml(description);
          const html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle ? sanitizedTitle : "Welcome"}</h2> <p>${
              sanitizedDescription ? sanitizedDescription : "Hello, Node.js"
            }</p>`,
            path === "/"
              ? '<a href="/create">create</a>'
              : `
              <a href="/create">create</a>
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>
              `
          );
          response.writeHead(200);
          response.end(html);
          return;
        }
      );
    });
  },
  createPostData: (title, response) => {
    fs.readdir("./data", function (err, filelist) {
      const title = "write article";
      const list = template.list(filelist);
      const html = template.HTML(
        title,
        list,
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
  },
};
