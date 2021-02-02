const express = require('express');
const bodyParser = require('body-parser');
const Spaces = require('../models/spaces');
const Questions = require('../models/questions');
const auth = require('../middleware/auth');

const spaceRouter = express.Router();

spaceRouter.use(bodyParser.json());

spaceRouter.route('/spaces')
.get( (req, res, next) => {

    Spaces.find({})
    .then((spaces) => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(spaces);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(auth, (req, res, next) => {

    res.statusCode = 403;
    res.end('POST operation not supported on /spaces');
})
.put(auth, (req, res, next) => {

    res.statusCode = 403;
    res.end('PUT operation not supported on /spaces');
})
.delete(auth, (req, res, next) => {

    res.statusCode = 403;
    res.end('DELETE operation not supported on /spaces');
})

// spaceRouter.route('/spaces/:spaceId')
// .get(auth, (req,res,next)=> {
    
//     Questions.find({})
//     .populate('author')
//     .then((question) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(question);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(auth, (req,res,next) => {
    
//     if (req.body != null) {
//         req.body.author = req.user._id;
//         Questions.create(req.body)
//         .then((question) => {
//             Questions.findById(question._id)
//             .populate('author')
//             .then((question) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(question);
//             })
//         }, (err) => next(err))
//         .catch((err) => next(err));
//     }
//     else {
//         err = new Error('Question not found in request body');
//         err.status = 404;
//         return next(err);
//     }

// })
// .put(auth, (req,res,next) => {
    
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /spaces/:spaceId');
// })
// .delete(auth, (req,res,next) => {
    
//     res.statusCode = 403;
//     res.end('DELETE operation not supported on /spaces/:spaceId');
// });

module.exports = spaceRouter;