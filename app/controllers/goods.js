var _ = require('underscore');
var Goods = require('../models/goods');

exports.save = function (req, res, next) {
    var id = req.body.goods._id;
    var goodsObj = req.body.goods;
    var _goods;

    if (id) {
        Goods.findById(id, function (err, goods) {
            if (err) {
                console.log(err);
            }

            _goods = _.extend(goods, goodsObj);
            _goods.save(function (err, goods) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/goods/' + goods._id);
            });
        });
    }
    else {
        _goods = new Goods(goodsObj);

        _goods.save(function (err, goods) {
            if (err) {
                console.log(err);
            }
            res.redirect('/goods/' + goods._id);
        });
    }
};

exports.detail = function(req, res, next){
    var id = req.params.id;
    Goods.findById(id, function(err, goods){
        if(err)     console.log(err)
        res.render('detail', {
            title: '详情' + goods.name,
            goods: goods,
        })
    })
}

exports.insert = function(req, res, next){
    res.render('goods_new', {
      title: '添加商品'
    })
}