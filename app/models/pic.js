var mongoose = require('mongoose');
var PicSchema = require('../schemas/pic');
var Pic = mongoose.model('pic', PicSchema);

module.exports = Pic;