var Author = require('../models/author'),
    Book = require('../models/book'),
    async = require('async');

exports.authorList = function (req, res, next) {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, listAuthors) {
            if (err) {
                return next(err);
            }

            res.render('authors/list', {
                title: 'Author List',
                data: listAuthors
            });
        })
};


exports.authorDetail = function (req, res, next) {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },
        authorsBooks: function (callback) {
            Book.find({'author': req.params.id}, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err || results.author == null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        res.render('authors/view', {
            title: 'Author Detail',
            author: results.author,
            authorBooks: results.authorsBooks
        });
    });

};

// Display Author create form on GET.
exports.author_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
