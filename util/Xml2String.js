var xml = require('node-xml');


var parse = new xml.SaxParser(function (cb) {

  var ToUserName = "";
  var FromUserName = "";
  var CreateTime = "";
  var MsgType = "";
  var Content = "";
  var tempName = "";

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
    console.log(tempName + ":" + cdata);
  });
  cb.onEndElementNS(function (elem, prefix, uri) {
    tempName = "";
  });
  cb.onEndDocument(function () {
    console.log('结束了！');
     var content = {
      'ToUserName' : ToUserName,
      'FromUserName' : FromUserName,
      'CreateTime' : CreateTime,
      'MsgType' : MsgType,
      'Content' : Content,
      'tempName' : tempName
    };
    // console.log(content);
    return content;
  });
});

exports.parse = parse;