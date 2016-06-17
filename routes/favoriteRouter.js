var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Verify = require('./verify');
var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {

    Favorites.find({postedBy: req.decoded._id})
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, fav) {
            if (err) return next(err);
            res.json(fav);
        });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {

    Favorites.find({postedBy: req.decoded._id}, function (err, existFav) {
        if (err) return next(err);
        if (existFav.length < 1) {

            Favorites.create({}, function (err, fav) {
                if (err) return next(err);

                console.log('Favorite created!');

                fav.postedBy = req.decoded._id
                fav.dishes.push(req.body._id);
                fav.save(function (err, fav) {
                    if (err) return next(err);
                    console.log('Added favorite!');
                    res.json(fav);
                })
            });
        } else {
            for (var i = 0; i < existFav[0].dishes.length; i++) {
                if (existFav[0].dishes[i] == req.body._id) {
                    var err = new Error('Dish already added to favorites list!');
                    err.status = 403;
                    return next(err);
                }
            }
            existFav[0].dishes.push(req.body._id);
            existFav[0].save(function (err, fav) {
                if (err) return next(err);
                console.log('Added favorite!');
                res.json(fav);
            })
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,
    function (req, res, next) {

        Favorites.remove({}, function (err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

favoriteRouter.route('/:dishId')

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {

    Favorites.find({postedBy: req.decoded._id}, function (err, fav) {

        var exist = false;
        var existFav = fav[0];

        if (existFav.length < 1) {
            var err = new Error('User without favorites list');
            err.status = 403;
            return next(err);
        } else {
            for (var i = 0; i < existFav.dishes.length; i++) {
                if (existFav.dishes[i] == req.params.dishId) {
                    existFav.dishes.splice(i, 1);
                    exist = true;
                }
            }
        }

        if (exist) {
            existFav.save(function (err, resp) {
                if (err) throw err;
                console.log('Favorite deleted!');
                res.json(resp);
            });
        } else {
            var err = new Error('Dish not found in user favorites list');
            err.status = 403;
            return next(err);
        }
    });
});

module.exports = favoriteRouter;