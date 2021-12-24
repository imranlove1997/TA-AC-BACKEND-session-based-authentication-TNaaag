var mongoose = require('mongoose');
var slug = require('slug');

var Schema = mongoose.Schema;

var articleSchema = new Schema ({
    title: { type: String},
    description: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment' },
    author: { type: String},
    slug: { type: String }
}, { timestamps: true });

articleSchema.pre('save', function(next) {
    this.slug = slug(this.title);
    next();
});

module.exports = mongoose.model('Article', articleSchema);