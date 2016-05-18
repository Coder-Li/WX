// var _ = require('underscore');
var Goods = require('../models/goods');
var Pic = require('../models/pic');
var fs = require('fs');

exports.savePic = function (req, res, next) {
    var picData = req.files.uploadPic;
    var filePath = picData.path;
    var originalFilename = picData.originalFilename;
    var id = req.body.goods._id;

    if (id) {
        if (originalFilename) {
            fs.readFile(filePath, function (err, data) {
                var timespamp = Date.now();
                var type = picData.type.split('/')[1];
                var pic = timespamp + '.' + type;
                var newPath = path.join(__dirname, '../../', '/public/pic/' + pic);

                fs.writeFile(newPath, date, function (err) {
                    var pic = new Pic({
                        url: newPath,
                        goods: id
                    });
                    //先保存pic表，再保存goods表
                    pic.save(function (err, pic) {
                        if (err) { console.log(err); }
                        Goods.findById(id, function (err, goods) {
                            goods.pic.push(pic._id);

                            goods.save();
                        })
                    })
                })
            })
        }
    }
    next();
}