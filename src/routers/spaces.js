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


module.exports = spaceRouter;