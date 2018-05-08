var Book = require('../models/book'),
    Bookinstance = require('../models/bookinstance'),
    Author = require('../models/author'),
    Genre = require('../models/genre'),
    async = require('async');

const { check,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function (req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};


exports.bookList = function (req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, listBooks) {
            if (err) return next(err);

            res.render('books/list', {title: 'Book List', data: listBooks})
        })
};


exports.bookDetail = function (req, res, next) {
    async.parallel({
            book: function (callback) {
                Book.findById(req.params.id)
                    .populate('author')
                    .populate('genre')
                    .exec(callback);
            },
            bookinstances: function (callback) {
                Bookinstance.find({'book': req.params.id})
                    .exec(callback)
            }
        }, function (err, results) {
            if (err || results.book == null) {
                var err = new Error('Book not found');
                err.status = 404;
                next(err);
            }

            res.render('books/view', {
                title: results.book.title,
                book: results.book,
                bookinstances: results.bookinstances
            })
        }
    );
};

// Display book create form on GET.
exports.bookСreateGet = function (req, res, next) {
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('books/createForm', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
exports.bookCreatePost = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre === 'undefined')
                req.body.genre = [] ;
            else
                req.body.genre = new Array(req.body.genre);
        }

        next();
    },

    // Validate fields.
    check('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    check('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    check('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    check('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                //successful - redirect to new book record.
                res.redirect(book.url);
            });
        }
    }

];

// Display book delete form on GET.
exports.book_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
