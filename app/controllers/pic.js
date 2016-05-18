// var _ = require('underscore');
var Goods = require('../models/goods');
var fs = require('fs');
var path = require('path');

exports.savePic = function (req, res, next) {
    var picData = req.files.uploadPic;
    var filePath = picData.path;
    var originalFilename = picData.originalFilename;

    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            if (err) console.log(err);

            var timespamp = Date.now();
            var type = picData.type.split('/')[1];
            var pic = timespamp + '.' + type;
            var newPath = path.join(__dirname, '../..', '/public/pic/' + pic);

            fs.writeFile(newPath, data, function (err) {
                if (err) { console.log(err) }
                req.picUrl = newPath;
                next();
            })
        });
    } else {
        next();
    }
}