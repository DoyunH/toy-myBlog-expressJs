const fs = require("fs");
const template = require("./template.js");

module.exports = {
  getPostData: (title, path, response) => {
    fs.readdir("./data", function (err, filelist) {
      fs.readFile(`./data/${title}`, "utf8", function (err, description) {
        const list = template.list(filelist);
        const html = template.HTML(
          title,
          list,
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
        return;
      });
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
