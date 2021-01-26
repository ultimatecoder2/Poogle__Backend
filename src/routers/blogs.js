const express = require('express');
const bodyParser = require('body-parser');
const Blogs = require('../models/blogs');
const auth = require('../middleware/auth');

const blogRouter = express.Router();

blogRouter.use(bodyParser.json());

blogRouter.route('/blogs')
.get(auth, (req, res, next) => {

    Blogs.find(req.query)
    .populate('author')
    .then((blogs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(auth, (req,res,next) => {
    
    if (req.body != null) {
        req.body.author = req.user._id;
        Blogs.create(req.body)
        .then((blog) => {
            Blogs.findById(blog._id)
            .populate('author')
            .then((blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Blog not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('PUT operation not supported on /blogs');
})
.delete(auth, (req,res,next) => {
    
    res.statusCode = 403;
    res.end('DELETE operation not supported on /blogs');
});

blogRouter.route('/blogs/:blogId')
.get(auth, (req,res,next) => {
    Blogs.findById(req.params.blogId)
    .populate('author')
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(auth, (req, res, next) => {
    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            if (!blog.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this blog!');
                err.status = 403;
                return next(err);
            }
            req.body.author = req.user._id;
            Blogs.findByIdAndUpdate(req.params.blogId, {
                $set: req.body
            }, { new: true })
            .then((blog) => {
                Blogs.findById(blog._id)
                .populate('author')
                .then((blog) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('Blog ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(auth, (req, res, next) => {

    Blogs.findById(req.params.blogId)
    .then((blog) => {
        if (blog != null) {
            if (!blog.author.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this blog!');
                err.status = 403;
                return next(err);
            }
            Blogs.findByIdAndRemove(req.params.blogId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('Blog with id ' + req.params.blogId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = blogRouter;