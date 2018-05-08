var Author = require('../models/author'),
    Book = require('../models/book'),
    async = require('async');

const {check, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

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
exports.authorCreateGet = function (req, res) {
    res.render('authors/createForm', {title: 'Create Author'});
};

// Handle Author create on POST.
exports.authorCreatePost = [

    check('first_name')
        .isLength({min: 1})
        .trim()
        .withMessage('First name must be specified.')
        .isAlphanumeric()
        .withMessage('First name has non-alphanumeric characters.'),
    check('family_name')
        .isLength({min: 1})
        .trim()
        .withMessage('Family name must be specified.')
        .isAlphanumeric()
        .withMessage('Family name has non-alphanumeric characters.'),
    check('date_of_birth', 'Invalid date of birth')
        .optional({checkFalsy: true})
        .isISO8601(),
    check('date_of_death', 'Invalid date of death')
        .optional({checkFalsy: true})
        .isISO8601(),


    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('authors/createForm', {title: 'Create Author', author: req.body, errors: errors.array()});
            return;
        }
        else {

            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.authorDeleteGet = function (req, res) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.author==null) { // No results.
            res.redirect('/catalog/author');
        }
        // Successful, so render.
        res.render('authors/deleteForm', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });
};

// Handle Author delete on POST.
exports.authorDeletePost = function (req, res) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('authors/deleteForm', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/author')
            })
        }
    });
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
