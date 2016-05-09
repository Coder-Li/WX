var Xml2String = require('../../util/Xml2String');

exports.autoSendMessage = function (req, res, next) {
  var post_data = "";
  req.on("data", function (data) { post_data = data; });
  req.on("end", function () {
    var xmlStr = post_data.toString('utf-8', 0, post_data.length);
    //消息数据结构
    // var ToUserName = "";
    // var FromUserName = "";
    // var CreateTime = "";
    // var MsgType = "";
    // var Content = "";
    // var tempName = "";
    //解析消息
    var content = Xml2String.parse.parseString(xmlStr);
    //回发消息
    CreateTime = parseInt(new Date().getTime() / 1000);
    var msg = "";
    //判断消息类型
    if (content.MsgType == "text") {
      msg = "谢谢关注,你说的是:" + content.Content;
      //组织返回的数据包
      var sendMessage = '<xml>' +
        '<ToUserName><![CDATA[' + content.FromUserName + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + content.ToUserName + ']]></FromUserName>' +
        '<CreateTime>' + CreateTime + '</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA[' + msg + ']]></Content>' +
        '</xml>';
      //  console.log(sendMessage);
      res.send(sendMessage);
      res.end();
    }
  });
}