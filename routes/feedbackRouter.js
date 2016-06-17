var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');
var Feedbacks = require('../models/feedback');

var feedbackRouter = express.Router();
feedbackRouter.use(bodyParser.json());


feedbackRouter.route('/')

.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {

    Feedbacks.find(req.query, function (err, feed) {
        if (err) return next(err);
        res.json(feed);
    });
})

.post(function (req, res, next) {

    Feedbacks.create(req.body, function (err, feed) {
        if (err) return next(err);
        console.log('Feedback created!');
        var id = feed._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the feedback with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {

    Feedbacks.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

//leaderId
feedbackRouter.route('/:feedbackId')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Feedbacks.findById(req.params.feedbackId, function (err, feed) {
        if (err) return next(err);
        res.json(feed);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {

    Feedbacks.findByIdAndUpdate(req.params.feedbackId, {
        $set: req.body
    }, {
        new: true
    }, function (err, feed) {
        if (err) return next(err);
        res.json(feed);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {

    Feedbacks.findByIdAndRemove(req.params.feedbackId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = feedbackRouter;