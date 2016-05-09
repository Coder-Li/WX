var express = require('express');
var router = express.Router();
var UtilCheck = require('../util/checkUrl');
var util = require('util');
var Message = require('../app/controllers/message');


module.exports = function (app) {
  /* GET home page. */
  //admin
  app.get('/', UtilCheck.checkUrl);

  //Message
  app.post('/', Message.getMessage, Message.sendMessage);
}
// module.exports = router;
