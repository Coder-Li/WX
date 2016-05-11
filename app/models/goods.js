var mongoose = require('mongoose');
var GoodsSchema = require('../schemas/goods');
var Goods = mongoose.model('goods', GoodsSchema);

module.exports = Goods;