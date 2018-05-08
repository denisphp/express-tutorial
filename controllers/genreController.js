const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Genre = require('../models/genre'),
    Book = require('../models/book'),
    async = require('async');


exports.genreList = function (req, res, next) {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function (err, genreAuthors) {
            if (err) {
                return next(err);
            }

            res.render('genres/list', {title: 'Genre List', data: genreAuthors});
        })
};

// Display detail page for a specific Genre.
exports.genreDetail = function (req, res, next) {
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genreBooks: function (callback) {
            Book.find({'genre': req.params.id})
                .exec(callback);
        },

    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }

        res.render('genres/view', {title: 'Genre Detail', genre: results.genre, genreBooks: results.genreBooks});
    });
};

// Display Genre create form on GET.
exports.genreCreateGet = function (req, res) {
    res.render('genres/createForm', {title: 'Create Genre'})
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};