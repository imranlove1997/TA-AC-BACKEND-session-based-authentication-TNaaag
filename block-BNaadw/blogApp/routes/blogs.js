var express = require('express');
var User = require('../models/user');
var Article = require('../models/article');
var Comment = require('../models/comment');
const article = require('../models/article');

var router = express.Router();

router.get('/', (req, res) => {
    console.log(req.session);
    Article.find({}, (err, articles) => {
        res.render('blogPage',{ articles });
    })
});

router.get('/new', (req, res) => {
    if(!req.session.userId) {
        res.redirect('/users/register');
    }
User.findOne({}, (err, user) => {
    if(err) return next(err);
    console.log(err, user);
    res.render('blogForm', { user });
})
})

router.post('/', (req, res, next) => {
    Article.create(req.body, (err, articlecreatetd) => {
        if(err) return next(err);
        return res.redirect('/blogs');
    })
})

router.get('/:slug', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({ slug }).populate('comments').exec((err, article) => {
        if(err) return next(err);
        res.render('singleArticle', { article });
    })
})

router.get('/:id/likes', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var id = req.params.id;
    Article.findByIdAndUpdate(id, { $inc: {likes: 1}}, (err, liked) => {
        if(err) return next(err);
        return res.redirect(`/blogs/${liked.slug}`);
    });
});

router.get('/:slug/edit', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var slug = req.params.slug;
    Article.findOne({ slug }, (err, article) => {
        if(err) return next(err);
        res.render('updateArticle', { article });
    });
})

router.post('/:slug', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var slug = req.params.slug;
    Article.findOneAndUpdate({ slug }, req.body, (err, articleUpdate) => {
        if(err) return next(err);
        return res.redirect(`/blogs/${articleUpdate.slug}`);
    })
})

router.get('/:slug/delete', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var slug = req.params.slug;
    Article.findOneAndDelete({ slug }, (err, deletedArticle) => {
        if(err) return next(err);
        Comment.deleteMany({ articleId: deletedArticle.id }, (err, delte) => {
            if(err) return next(err);
            return res.redirect(`/blogs`);
        })
    })
})

router.post('/:slug/comment', (req, res, next) => {
    if(!req.session.userId) {
        return res.redirect('/users/register');
    }
    var slugArticle = req.params.slug;
    req.body.articleId = slugArticle;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);
        Article.findOneAndUpdate({ slug: slugArticle}, { $push:{ comments: comment.id }}, (err, articleUpdate) => {
            if(err) return next(err);
            return res.redirect(`/blogs/${articleUpdate.slug}`);
        })
    })
})

module.exports = router;