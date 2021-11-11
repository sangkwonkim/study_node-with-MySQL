module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">Author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors, author_id){
    // update, create를 할 경우에, author를 선택할 수 있도록 한다.
    var tag = ``
    var i = 0;
    while(i<authors.length) {
      var selected = '';
      if(authors[i].id === author_id) {
        selected = ` selected`;
        // option에 seleceted가 들어가면 default 값으로 먼저 선택되어진 부분이 option에 나타나게 된다.
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  },authorTable:function(authors){
    var tag = `<table>`;
    var i = 0;
    while(i< authors.length) {
        tag += `
        <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td><a href="/author/update?id=${authors[i].id}">Update</a></td>
            <td>
              <form action="/author/delete_process" method="post">
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value="delete">
              </form>
            </td>
        </tr>
        `
        i++
    }
    tag += '</table>'
    return tag;
  }
}
