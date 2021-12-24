var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Article = require('../models/article');
var User = require('../models/user');

router.get('/:id/edit', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render('updateComment', { comment });
    })
})

router.post('/:id', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, commentUpdated) => {
        if(err) return next(err);
        return res.redirect('/blogs/' + commentUpdated.articleId);
    })
})

router.get('/:id/delete', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var id = req.params.id;
    Comment.findByIdAndDelete(id, (err, deletedComment) => {
        if(err) return next(err);
        Article.findOneAndUpdate({ slug: deletedComment.articleId }, {$pull: {comments: deletedComment.id }}, (err, article) => {
            if(err) return next(err);
            return res.redirect('/blogs/' + deletedComment.articleId);
        })
    })
})

router.get('/:id/like', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, { $inc: {likes: 1}}, (err, liked) => {
        console.log(err, liked);
        if(err) return next(err);
        return res.redirect(`/blogs/${liked.articleId}`);
    })
})

module.exports = router;