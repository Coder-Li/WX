var _ = require('underscore');
var Goods = require('../models/goods');
var Category = require('../models/category');
var Pic = require('../models/pic');

//存储和修改物品信息的逻辑
exports.save = function (req, res, next) {
    var id = req.body.goods._id;
    var goodsObj = req.body.goods;
    var picUrl = req.picUrl;
    var _goods;
    
    console.log('id');
    console.log(id);
    console.log('picUrl')
    console.log(picUrl)
    
    if (id) {
        console.log('这是有ID的区域，一般不会进来的！')
        Goods.findById(id, function (err, goods) {
            if (err) {
                console.log(err);
            }

            _goods = _.extend(goods, goodsObj);
            _goods.save(function (err, goods) {
                if (err) {
                    console.log(err);
                }

                goods.pic = savepic2db(picUrl, goods) || ''
                goods.save(function (err, goods) {
                    if (err) { console.log(err) }
                    else {
                        res.redirect('/goods/' + goods._id);
                    }
                })
            });
        });
    }
    else {
        console.log('没有ID应该来这！')
        _goods = new Goods(goodsObj);

        var categoryId = _goods.category;
        var categoryName = goodsObj.categoryName;

        _goods.save(function (err, goods) {
            if (err) {
                console.log(err);
            }
            
            console.log('我想看看goods:' + goods);
            goods.pic = savepic2db(picUrl, goods) || ''
            goods.save(function (err, goods) {
                if (err) { console.log(err) }
            })

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

//save pic fun
function savepic2db(picUrl, goods) {
    if (picUrl) {
        var pic = new Pic({
            goods: goods._id,
            url: picUrl
        });

        pic.save(function (err, pic) {
            if (err) { console.log(err) }
            else {
                return pic._id;
            }
        })
    } else {
        console.log('没有图片！')
        return undefined;
    }
}