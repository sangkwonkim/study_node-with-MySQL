var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db')
var topic = require('./lib/topic')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){ // 글 목록 가져오기 기능
        topic.home(request, response);
      } else {
        topic.page(request, response)
      }
    } else if(pathname === '/create'){
      topic.create(request, response)
    } else if(pathname === '/create_process'){ // create에서 submit을 누를 경우 작동하는 url
      topic.create_process(request, response)
    } else if(pathname === '/update'){
      topic.update(request, response)
    } else if(pathname === '/update_process'){
      topic.update_process(request, response)
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response)
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
