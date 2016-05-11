var request = require('request');

var appid = 'wx60593027c1014be4';
var secret = '7e41f5a4f9e0dc816419e4f74d7980fb';
var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret;
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})