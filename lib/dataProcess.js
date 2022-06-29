const fs = require("fs");

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
};
