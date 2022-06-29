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
  list: (filelist) => {
    const list = filelist
      .map((file) => {
        return `<li><a href='/?id=${file}'>${file}</a></li>`;
      })
      .join("\n");
    return list;
  },
};
