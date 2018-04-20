var Book = require('../models/book'),
    Bookinstance = require('../models/bookinstance'),
    async = require('async');

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


exports.bookDetail = function (req, res) {
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
exports.book_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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
