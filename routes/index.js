var express = require('express');
var router = express.Router();
var UtilCheck = require('../util/checkUrl');
var util = require('util');
var multipartyMiddleware = require('connect-multiparty')();

var Message = require('../app/controllers/message');
var Goods = require('../app/controllers/goods');
var Pic = require('../app/controllers/pic');


module.exports = function (app) {
  /* GET home page. */
  //admin
  app.get('/', UtilCheck.checkUrl);
  // page
  app.get('/index', function (req, res, next) {
    res.render('index', {
      title: 'Express'
    })
  })
  //Message
  app.post('/',
    Message.getMessage,
    Message.dealText,
    Message.dealNews,
    Message.dealOnStarEvent,
    Message.sendMessage,
    Message.SendNewMessage,
    Message.endMiddleware
  );
  
  //Goods
  app.get('/admin/goods/new', Goods.insert);
  app.post('/admin/goods/new',multipartyMiddleware, Pic.savePic, Goods.save);
  app.get('/goods/:id', Goods.detail);
  
}
// module.exports = router;
