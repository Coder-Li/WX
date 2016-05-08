var express = require('express');
var router = express.Router();
var util = require('util');

var jsSHA = require('jssha');


var token = 'test';

/* GET home page. */
// /?signature=c9fab82fe4f95585d46657934a470bd37160d196&echostr=2439227987601620991&timestamp=1462713885&nonce=1620159903
router.get('/', function(req, res, next) {
  // console.log('the req is:\n' + util.inspect(req));
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;
  
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = token;
  
  oriArray.sort();
  console.log(oriArray)
  
  var original = oriArray.join('');
  console.log('original:');
  console.log(original);
  var shaObj = new jsSHA('SHA-1', 'TEXT');
  shaObj.update(original);
  console.log('shaObj:')
  console.log(shaObj)
  var scyptoString=shaObj.getHash('HEX'); 
  
  console.log('signature:');
  console.log(signature);
  console.log('scyptoString:');
  console.log(scyptoString);
  
  if(signature === scyptoString){
    //chenggong
  res.end(echostr);
  }
  // 以上是判断url
});

module.exports = router;
