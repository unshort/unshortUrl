#!/usr/local/bin/node

var http = require('http')
  ,url = require('url')
  ,util = require('util')
  ;

var _finalUrlHandler;
var _lastUrl = '';
var _bounced = 0;

var _handleHttpRequestError=function(e){
  console.log(e);
}

function _getRequestOptForUrl( urlString ) {
  var u = url.parse(urlString);
  var opt = {
    hostname : u.hostname,
    path : u.path,
    method : 'HEAD'
  };
  return opt;
};

function _getUrlFromRes(res,url) {
  //_inspect(res.headers);
  var result = url;
  if ( typeof res.headers != 'undefined' ) {
    if ( typeof res.headers.location != 'undefined') {
      result = res.headers.location;
    }
  }
  return result;
};

function _getNewUrl(url,callback) {
  var newUrl;
  var opts = _getRequestOptForUrl(url);
  req = http.request(opts,function(res){
    newUrl = _getUrlFromRes(res,url);
    callback(newUrl);
  });
  req.end();
}

var _checkNextUrl= function(url,callback) {
  // _log('url : ' + url );
  // _log('_previousUrl : ' + _previousUrl +"\n\n");
  if ( url != _previousUrl ) {
    _bounced++;
    _previousUrl = url;
    _getNewUrl(url, function(newUrl) {
      _checkNextUrl(newUrl,_checkNextUrl);
    });
  } else {
    _finalUrlHandler(url);
  }
}

var unshorten = function(url,apiClientCallback) {
  //_log(".init");
  _finalUrlHandler = apiClientCallback;
  _previousUrl = "";
  _checkNextUrl(url,_checkNextUrl);
};

var _log = function ( message ) {
  util.log(message);
}

var _inspect = function(obj) {
  util.log( util.inspect(obj,
      {
        showHidden:true,
        colors:true
      } 
    ));
}

//***********************************

var handleFinalUrl = function(url) {
  console.log("Final url : " + url );
}

var argUrl = process.argv[process.argv.length-1];
var urlToUnshort = argUrl;
unshorten(urlToUnshort,handleFinalUrl);
