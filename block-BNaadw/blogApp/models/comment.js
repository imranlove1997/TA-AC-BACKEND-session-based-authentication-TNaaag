var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema ({
    name: { type: String },
    comment: { type: String},
    likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);