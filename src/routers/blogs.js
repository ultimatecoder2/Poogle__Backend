const express = require('express');
const bodyParser = require('body-parser');
const Blogs = require('../models/blogs');
const auth = require('../middleware/auth');
const multer = require("multer");

const blogRouter = express.Router();

blogRouter.use(bodyParser.json());

// // STORAGE MULTER CONFIG
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     },
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname)
//         if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
//             return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
//         }
//         cb(null, true)
//     }
// });

// const upload = multer({ storage: storage }).single("file");

// router.post("/uploadfiles", (req, res) => {
//     upload(req, res, err => {
//         if (err) {
//             return res.json({ success: false, err });
//         }
//         return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
//     });
// });

blogRouter.route('/blogs')
.get( (req, res, next) => {

    Blogs.find()
    //.populate('author')
    .then((blogs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blogs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req,res,next) => {
    
    if (req.body != null) {
        //req.body.author = req.user._id;
        Blogs.create(req.body)
        .then((blog) => {
            Blogs.findById(blog._id)
            //.populate('author')
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
.get( (req,res,next) => {
    Blogs.findById(req.params.blogId)
    //.populate('author')
    .then((blog) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(blog);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
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
                //.populate('author')
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
.delete( (req, res, next) => {

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

// const express = require('express');
// const router = express.Router();
// const { Blog } = require("../models/blogs");
// const auth = require('../middleware/auth');
// const multer = require("multer");

// // STORAGE MULTER CONFIG
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}_${file.originalname}`);
//     },
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname)
//         if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
//             return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
//         }
//         cb(null, true)
//     }
// });

// const upload = multer({ storage: storage }).single("file");

// //=================================
// //             Blog
// //=================================

// // fieldname: 'file',
// // originalname: 'React.png',
// // encoding: '7bit',
// // mimetype: 'image/png',
// // destination: 'uploads/',
// // filename: '1573656172282_React.png',
// // path: 'uploads/1573656172282_React.png',
// // size: 24031 

// router.post("/uploadfiles", (req, res) => {
//     upload(req, res, err => {
//         if (err) {
//             return res.json({ success: false, err });
//         }
//         return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
//     });
// });

// router.post("/createPost", (req, res) => {
//     let blog = new Blog({ content: req.body.content});
//     //, writer: req.body.userID 
//     blog.save((err, postInfo) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).json({ success: true, postInfo })
//     })

// });


// router.get("/getBlogs", (req, res) => {
//     Blog.find()
//         //.populate("writer")
//         .exec((err, blogs) => {
//             if (err) return res.status(400).send(err);
//             res.status(200).json({ success: true, blogs });
//         });
// });

// router.post("/getPost", (req, res) => {
//     console.log(req.body)
//     Blog.findOne({ "_id": req.body.postId })
//         //.populate('writer')
//         .exec((err, post) => {
//             if (err) return res.status(400).send(err);
//             res.status(200).json({ success: true, post })
//         })
// });

// module.exports = router;
