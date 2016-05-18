//模式定义
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// 这里面放跟电影有过的字段和类型
var GoodsSchema = new Schema({
    name: String,     //姓名
    pirce: String,    //价格
    area: String,     //区域
    degree: String,   //新旧程度
    summary: String,  //详情
    pic: {
        type: ObjectId,
        ref: 'pic'
    },      //图片url
    amount: {         //数量
        type: Number,
        default: 1
    },   //数量
    category: {    //类别
        type: ObjectId,
        ref: 'category'
    },
    pv: {           //访问量
        type: Number,
        default: 0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//存数据前都会调用
GoodsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
});

GoodsSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}
module.exports = GoodsSchema