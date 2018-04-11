var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
var async = require('async');

exports.index = function (req, res) {
    async.parallel({
        bookCount: function (callback) {
            Book.count({}, callback);
        },
        bookinstanceCount: function (callback) {
            BookInstance.count({}, callback);
        },
        bookinstanceAvailableCount: function (callback) {
            BookInstance.count({status: 'Available'}, callback);
        },
        authorCount: function (callback) {
            Author.count({}, callback);
        },
        genreCount: function (callback) {
            Genre.count({}, callback);
        }
    }, function (err, results) {
        res.render('index', {title: '', error: err, data: results});
    });
};
