var unshortener = require('./unshorten.js');

var handleFinalUrl = function(url) {
  console.log("Final url : " + url );
}

// take last agrument as url
var argUrl = process.argv[process.argv.length-1];
var urlToUnshort = argUrl;

unshortener.unshorten(urlToUnshort,handleFinalUrl);

