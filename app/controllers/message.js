// var Xml2String = require('../../util/Xml2String');
var xml = require('node-xml');
var Goods = require('../models/goods');

exports.getMessage = function (req, res, next) {
  var post_data = '';
  req.on('data', function (data) {
    post_data += data;
  });
  req.on('end', function () {
    var xmlStr = post_data.toString('utf-8', 0, post_data.length);
    //消息数据结构
    var ToUserName = "";
    var FromUserName = "";
    var CreateTime = "";
    var MsgType = "";
    var Content = "";
    var tempName = "";
    var PicUrl = '';
    var Location_X = '';
    var Location_Y = '';
    var Scale = '';
    var Label = '';
    var Event = '';
    
    //解析消息
    // var content = Xml2String.parse.parseString(xmlStr);
    var parse = new xml.SaxParser(function (cb) {

      cb.onStartElementNS(function (elem, attra, prefix, uri, namespaces) {
        tempName = elem;
      });
      cb.onCharacters(function (chars) {
        chars = chars.replace(/(^\s*)|(\s*$)/g, "");
        if (tempName == "CreateTime") {
          CreateTime = chars;
        }
      });
      cb.onCdata(function (cdata) {
        if (tempName == "ToUserName") {
          ToUserName = cdata;
        } else if (tempName == "FromUserName") {
          FromUserName = cdata;
        } else if (tempName == "MsgType") {
          MsgType = cdata;
        } else if (tempName == "Content") {
          Content = cdata;
        } else if(tempName === "PicUrl"){
          PicUrl = cdata;
        } else if(tempName === 'Location_X'){
          Location_X = cdata;
        } else if(tempName === 'Location_Y'){
          Location_Y = cdata;
        } else if(tempName === 'Scale'){
          Scale = cdata;
        } else if(tempName === 'Label'){
          Label = cdata;
        } else if(tempName === 'Event'){
          Event = cdata;
        }
        // console.log(tempName + ":" + cdata);
      });
      cb.onEndElementNS(function (elem, prefix, uri) {
        tempName = "";
      });
      cb.onEndDocument(function () {
      });
    });
    parse.parseString(xmlStr);
    var cont = {
      'ToUserName': ToUserName,
      'FromUserName': FromUserName,
      'CreateTime': CreateTime,
      'MsgType': MsgType,
      'Content': Content,
      'tempName': tempName,
      'PicUrl': PicUrl,
      'Location_X': Location_X,
      'Location_Y': Location_Y,
      'Scale': Scale,
      'Label': Label,
      'Event': Event
    };
    req.session.cont = cont;
    next();
  });
}

exports.sendMessage = function (req, res, next) {
  if (req.session.cont.MsgType === "text" || req.session.cont.MsgType === 'event') {
    var cont = req.session.cont;
    var msg = req.session.msg ;
    CreateTime = parseInt(new Date().getTime() / 1000);
    
    var sendMess = '<xml>' +
      '<ToUserName><![CDATA[' + cont.FromUserName + ']]></ToUserName>' +
      '<FromUserName><![CDATA[' + cont.ToUserName + ']]></FromUserName>' +
      '<CreateTime>' + CreateTime + '</CreateTime>' +
      '<MsgType><![CDATA[text]]></MsgType>' +
      '<Content><![CDATA[' + msg + ']]></Content>' +
      '</xml>';
    res.send(sendMess);
    res.end();
  }
  else {
    next();
  }
}

exports.dealText = function(req, res, next){
  // console.log(req.session);
  if(req.session.cont.MsgType === 'text'){
    var cont = req.session.cont;
    var msg = '';
    
    if(RegExp("你好").test(cont.Content)){
      msg = '你好呀，我是Rose机器人！';
    }
    else if(RegExp("最美丽").test(cont.Content)){
      msg = '当然是王志英啊';
    }
    else if(RegExp("最傻").test(cont.Content)){
      msg = '当然是李京阳啊';
    }
    else if(RegExp("测试").test(cont.Content)){
      msg = '请联系858582381@qq.com提交测试体验';
    }
    else if(RegExp("图片").test(cont.Content)){
      req.session.cont.MsgType = 'news';
    }
    else {
      msg = '你说的是"' + cont.Content + '"吗？';
    }
    if(msg){
      req.session.msg = msg;
    }
    next();
  }else{
    next();
  }
}


exports.dealImage = function(req, res, next){
  if(req.session.cont.MsgType === 'image'){
    
    next();
  }else{
    next();
  }
}

//当有人关注时，返回的消息
exports.dealOnStarEvent = function(req, res, next){
  if(req.session.cont.MsgType === 'event' || req.session.cont.Event === 'subscribe'){
    var msg = '欢迎关注！本公众号旨在为华航学子提供一个二手商品交易的平台。请按一下步骤操作:\n   1.看商品   \n   2.卖商品    \n\n\n\n输入“？”查看帮助';
    req.session.msg = msg;
    next();
  }else{
    next();
  }
}

exports.dealNews = function(req, res, next){
  if(req.session.cont.MsgType === 'news'){
    var news= [];
    Goods.findOne({}, function(err, goods){
      if(err){
        console.log(err);
      }
      else{
        var title = goods.name;
        var description = goods.summary;
        var picurl = 'http://lijingyang.tunnel.qydev.com' + goods.pic ;
        var url = 'http://lijingyang.tunnel.qydev.com/goods/' + goods._id;
        news.push({ 'title':title,
                    'description':description,
                    'picurl':picurl,
                    'url':url});
        console.log(news);
      }
      req.session.news = news;
      next();
    })
  }else{
    next();
  }
}

exports.SendNewMessage = function(req, res, next){
  if(req.session.cont.MsgType === 'news' && req.session.news){
      var cont = req.session.cont;
      var news = req.session.news;
      CreateTime = parseInt(new Date().getTime() / 1000);
      var ArticleCount = news.length;
      
      var itemStr = '';
      var sendMess = '<xml>' +
           '<ToUserName><![CDATA[' + cont.FromUserName + ']]></ToUserName>' +
           '<FromUserName><![CDATA[' + cont.ToUserName + ']]></FromUserName>' +
           '<CreateTime>' + CreateTime + '</CreateTime>' +
           '<MsgType><![CDATA[news]]></MsgType>' +
           '<ArticleCount>' + ArticleCount + '</ArticleCount>' +
           '<Articles>' ;
           news.forEach(function(item) {
             itemStr += '<item>' +
                        '<Title><![CDATA[' + item.title + ']]></Title> ' +
                        '<Description><![CDATA[' + item.description + ']]></Description>' +
                        '<PicUrl><![CDATA[' + item.picurl + ']]></PicUrl>' +
                        '<Url><![CDATA[' + item.url + ']]></Url>' +
                        '</item>';
           }, this);
           sendMess += itemStr + '</Articles>' + '</xml>';
           
      // console.log(sendMess);
      res.send(sendMess);
      res.end();
  }else{
    next();
  }
}

exports.endMiddleware = function(req, res, next){
  res.end(' ');
}