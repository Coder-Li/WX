var express = require('express');
var router = express.Router();
var UtilCheck = require('../util/checkUrl');
// var util = require('util');

/* GET home page. */
// /?signature=c9fab82fe4f95585d46657934a470bd37160d196&echostr=2439227987601620991&timestamp=1462713885&nonce=1620159903
router.get('/', function (req, res, next) {
  var echostr = req.query.echostr;
  //如果认证成功就返回 echostr
  if (UtilCheck.checkUrl(req, res, next)) {
    res.end(echostr);
  }
});
module.exports = router;
