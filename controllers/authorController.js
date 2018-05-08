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
            res.render('author_form', {title: 'Create Author', author: req.body, errors: errors.array()});
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
