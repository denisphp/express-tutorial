var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

const {check, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

// Display list of all BookInstances.
exports.bookinstanceList = function (req, res, next) {
    BookInstance.find()
        .populate('book')
        .exec(function (err, bookinstances) {
            if (err) {
                return next(err);
            }

            res.render('bookinstances/list', {title: 'Book Instance List', data: bookinstances});
        });

};

// Display detail page for a specific BookInstance.
exports.bookinstanceDetail = function (req, res, next) {
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) {
            if (err) {
                return next(err);
            }
            if (bookinstance == null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('bookinstances/view', {title: 'Book:', bookinstance: bookinstance});
        })
};

// Display BookInstance create form on GET.
exports.bookinstanceCreateGet = function (req, res) {
    Book.find({}, 'title')
        .exec(function (err, books) {
            if (err) {
                return next(err);
            }
            // Successful, so render.
            res.render('bookinstances/createForm', {title: 'Create BookInstance', book_list: books});
        });
};

// Handle BookInstance create on POST.
exports.bookinstanceCreatePost = [

    // Validate fields.
    check('book', 'Book must be specified')
        .isLength({min: 1})
        .trim(),
    check('imprint', 'Imprint must be specified')
        .isLength({min: 1})
        .trim(),
    check('due_back', 'Invalid date')
        .optional({checkFalsy: true})
        .isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title')
                .exec(function (err, books) {
                    if (err) {
                        return next(err);
                    }
                    // Successful, so render.
                    res.render('bookinstance_form', {
                        title: 'Create BookInstance',
                        book_list: books,
                        selected_book: bookinstance.book._id,
                        errors: errors.array(),
                        bookinstance: bookinstance
                    });
                });

            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new record.
                res.redirect(bookinstance.url);
            });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};