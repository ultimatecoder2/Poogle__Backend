const express = require('express');
const bodyParser = require('body-parser');
const auth = require('../middleware/auth');
const cors = require('./cors');
const Blogs = require('../models/blogs');
const Questions = require('../models/questions');
const { search } = require('./blogReactions');

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());

searchRouter.route('/search')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req, res, next) => {

    Questions.find({
        heading: {
            $regex: new RegExp(q)
        }
    }).limit(5)
    .then((questions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(question);
    }, (err) => next(err))
    .catch((err) => next(err))
});

module.exports = searchRouter;
