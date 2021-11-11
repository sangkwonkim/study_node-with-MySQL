var http = require('http');
var url = require('url');
// URL 모듈은 웹 주소를 읽을 수 있는 부분으로 분할합니다.
var topic = require('./lib/topic')
var author = require('./lib/author')

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
// url.parse() 메서드로 주소를 구문 분석하면 주소의 각 부분이 속성으로 포함된 URL 개체가 반환됩니다.
// The url.parse() method takes a URL string, parses it, and returns a URL object.

// console.log(_url) => topic.home로 가게 되면 '/' 이며, 특정 글의 page로 가면 '/?id=~~'가 된다
// => '/?id=~~' 부분을 객체 형태(아래와 같은)로 만들어서 넘겨주는 게 url.parse

// console.log(url.parse(_url, true))
// topic.home 일 때의 url.parse(_url, true)
// Url {protocol: null, slashes: null, auth: null, host: null, port: null, hostname: null, hash: null, search: null, query: [Object: null prototype] {}, pathname: '/', path: '/', href: '/'}
// 특정 글의 page로 갔을 때 queryData
// Url {protocol: null, slashes: null, auth: null, host: null, port: null, hostname: null, hash: null, search: '?id=9', query: [Object: null prototype] { id: '9' }, pathname: '/',path: '/?id=9',  href: '/?id=9'}

// url.parse(urlString[, parseQueryString[, slashesDenoteHost]])
// urlString <string> The URL string to parse.
// parseQueryString <boolean> If true, the query property will always be set to an object returned by the querystring module's parse() method. 
// If false, the query property on the returned URL object will be an unparsed, undecoded string. Default: false.

  var pathname = url.parse(_url, true).pathname;
  // console.log(pathname)
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
  } else if(pathname === '/author'){
    author.home(request, response)
  } else if(pathname === '/author/create_process'){
    author.create_process(request, response)
  } else if(pathname === '/author/update'){
    author.update(request, response)
  } else if(pathname === '/author/update_process'){
    author.update_process(request, response)
  } else if(pathname === '/author/delete_process'){
    author.delete_process(request, response)
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);
