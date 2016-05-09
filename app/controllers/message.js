// var Xml2String = require('../../util/Xml2String');
var xml = require('node-xml');

exports.autoSendMessage = function (req, res, next) {
  var post_data = "";
  req.on("data", function (data) { post_data = data; });
  req.on("end", function () {
    var xmlStr = post_data.toString('utf-8', 0, post_data.length);
    //消息数据结构
    var ToUserName = "";
    var FromUserName = "";
    var CreateTime = "";
    var MsgType = "";
    var Content = "";
    var tempName = "";
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
    //回发消息
    CreateTime = parseInt(new Date().getTime() / 1000);
    var msg = "";
    //判断消息类型
    // console.log('MsgType:' + MsgType);
    if (MsgType === "text") {
      if (Content === '你好') {
        msg = '你也好啊，我是机器人Rose'
      }
      else if (Content === '测试') {
        msg = '测出什么来了吗？'
      }
      else {
        msg = "谢谢关注,你说的是:" + Content;
      }

      // console.log(msg);
      //组织返回的数据包
      var sendMessage = '<xml>' +
        '<ToUserName><![CDATA[' + FromUserName + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + ToUserName + ']]></FromUserName>' +
        '<CreateTime>' + CreateTime + '</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA[' + msg + ']]></Content>' +
        '</xml>';
      //  console.log(sendMessage);
      res.send(sendMessage);
      res.end();
    }
    else {
      res.end(' ');
    }
  });
}

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
      'tempName': tempName
    };
    req.session.cont = cont;
    next();
  });
}

exports.sendMessage = function (req, res, next) {
  console.log(req.session);
  var cont = req.session.cont;
  // var text = req.session.text;
  console.log(cont?'yes':'no');
  // console.log(text);
  CreateTime = parseInt(new Date().getTime() / 1000);
  var msg = "";

  if (cont.MsgType === "text") {
    if (cont.Content === '你好') {
      msg = '你也好啊，我是机器人Rose'
    }
    else if (cont.Content === '测试') {
      msg = '测出什么来了吗？'
    }
    else {
      msg = "谢谢关注,你说的是:" + cont.Content;
    }

    //组织返回的数据包
    var sendMess = '<xml>' +
      '<ToUserName><![CDATA[' + cont.FromUserName + ']]></ToUserName>' +
      '<FromUserName><![CDATA[' + cont.ToUserName + ']]></FromUserName>' +
      '<CreateTime>' + CreateTime + '</CreateTime>' +
      '<MsgType><![CDATA[text]]></MsgType>' +
      '<Content><![CDATA[' + msg + ']]></Content>' +
      '</xml>';
    //  console.log(sendMess);
    res.send(sendMess);
    res.end();
  }
  else {
    res.end(' ');
  }
}