var db = require('./db')
var template = require('./template')
var url = require('url');
var qs = require('querystring');

// querystring
// querystring 모듈도 nodejs의 built-in 모듈이며, url 쿼리 스트링을 해석하고 포맷팅할 수 있다. 
// 다만, express를 사용한다면, querystring보다는 body-parser를 사용한다.

// querystring.parse()
// url query string을 분석하여 객체로 반환해준다.

// querystring.stringify()
// query 객체를 문자열로 바꾸어주는 역할을 한다.


exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html)
    })
}

exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (error, topics) => { // 상세페이지에 들어가더라도 리스트는 그대로 남아있어야된다. 해당 select구문에 해당하는 내용들이 list에 들어가게 된다.
        if(error) {
          throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
          // LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=? 
          // SELECT 하는 테이블과 연관되어 있는 테이블을 부르기 위해서 LEFT JOIN '붙일 테이블' ON 'SELECT하는 테이블과 붙일 테이블의 연관이 있는 부분' 하면 하나의 테이블로 확인할 수 있다.
          if(error2) { // id=? 중 ?에 해당하는 값은 두번째인자인 배열로 치환되서 자동으로 입력이 된다. => 공격의도가 있는 건 자동적으로 세탁이 된다.
            throw error2
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>
            ${description}
            <p>by ${topic[0].name}</p>
            `,
            ` <a href="/create">create</a>
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
          );
          response.writeHead(200);
          response.end(html)
        })
      })
}

exports.create = function(request, response){
    db.query(`SELECT * FROM topic`, (error, topics) => {
        db.query(`SELECT * FROM author`, function(error, authors){
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(title, list,
          `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html)
        })
      })
}

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          INSERT INTO topic (title, description, created, author_id) 
          VALUES(?, ?, NOW(), ?);`,
          [post.title, post.description, post.author],
          function(error, result) {
            if(error) {
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
          )
    });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function(error, topics){
        if(error) {
          throw error
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2) {
            throw error2
          }
          db.query(`SELECT * FROM author`, function(error, authors){
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          })
        });
      });
}

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
        // console.log(body) id=9&title=kimsangkwon&description=kimsangkwon+is+very+handsome&author=3
    });
    request.on('end', function(){
        var post = qs.parse(body);
        // console.log(post)
        //[Object: null prototype] {id: '9', title: 'kimsangkwon', description: 'kimsangkwon is very handsome', author: '3'}
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        })
    });
}

exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id = ?`, [post.id], function(error, result){
          if(error) {
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        })
    });
}