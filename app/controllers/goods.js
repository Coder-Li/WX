var _ = require('underscore');
var Goods = require('../models/goods');
var Category = require('../models/category');

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

        var categoryId = _goods.category;
        var categoryName = goodsObj.categoryName;

        _goods.save(function (err, goods) {
            if (err) {
                console.log(err);
            }

            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    category.goods.push(goods._id);

                    category.save(function (err, category) {
                        res.redirect('/goods/' + goods._id);
                    })
                })
            } else if (categoryName) {
                var category = new Category({
                    name: categoryName,
                    goods: [goods._id]
                });

                category.save(function (err, category) {
                    goods.category = category._id;

                    goods.save(function (err, goods) {
                        res.redirect('/goods/' + goods._id);
                    })
                })
            }
        });
    }
};

exports.detail = function (req, res, next) {
    var id = req.params.id;
    //浏览量计数器
    Goods.update({ _id: id }, { $inc: { pv: 1 } }, function (err) {
        console.log(err);
    })

    Goods.findById(id, function (err, goods) {
        if (err) console.log(err)
        res.render('detail', {
            title: '详情' + goods.name,
            goods: goods,
        })
    })
}

//render 添加商品的page
exports.insert = function (req, res, next) {
    Category.find({}, function (err, categories) {
        res.render('goods_new', {
            title: '添加商品',
            categories: categories,
            goods: {}
        })
    })
}