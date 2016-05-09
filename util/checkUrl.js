var jsSHA = require('jssha');

exports.checkUrl = function (req, res, next) {
  var token = 'test';
  //获取parmas
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;

  if (signature && timestamp && nonce && echostr) {

    //进行字典排序
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;

    oriArray.sort();
    // console.log(oriArray)
    //sha1 加密
    var original = oriArray.join('');
    // console.log('original:');
    // console.log(original);
    var shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(original);
    // console.log('shaObj:')
    // console.log(shaObj)
    var scyptoString = shaObj.getHash('HEX');
    // console.log('signature:');
    // console.log(signature);
    // console.log('scyptoString:');
    // console.log(scyptoString);

    //判断匹配
    if (signature === scyptoString) {
      res.end(echostr);
    }
    else {
      res.end();
    }
  }
  else {
    res.end();
  }
}


