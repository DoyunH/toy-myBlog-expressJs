module.exports = {
  HTML: (title, list, body, control) => {
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
  list: (topics) => {
    const list = topics
      .map((topic, i) => {
        return `<li><a href='/?id=${topics[i].id}'>${topics[i].title}</a></li>`;
      })
      .join("\n");
    return list;
  },
};
