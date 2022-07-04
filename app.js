const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const template = require("./lib/template.js");
const postData = require("./lib/postData.js");
const dataProcess = require("./lib/dataProcess.js");
const sanitizeHtml = require("sanitize-html");
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lucas9436",
  database: "myblog",
});
db.connect();

const app = http.createServer(function (request, response) {
  let _url = request.url;
  let query = url.parse(_url, true).query;
  // url info check
  let pathname = url.parse(_url, true).pathname;
  let path = url.parse(_url, true).path;
  let title = query.id;

  if (pathname === "/") {
    // postData.getPostData(title, path, response);
    db.query(`SELECT * FROM topic`, function (err, topics) {
      if (err) {
        throw err;
      }
      db.query(
        `SELECT * FROM topic ${query.id && "WHERE id=?"}`,
        [query.id],
        (err2, topic) => {
          if (err2) {
            throw err2;
          }
          // check is Main or Not
          const isMain = topic.length !== 1;

          const list = template.list(topics);
          const sanitizedTitle = sanitizeHtml(
            isMain ? "Welcome" : topic[0].title
          );
          const sanitizedDescription = sanitizeHtml(
            isMain ? "Here is a Doyun's Blog" : topic[0].description
          );
          const html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2> <p>${sanitizedDescription}</p>`,
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
