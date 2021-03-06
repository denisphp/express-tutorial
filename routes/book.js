var express = require('express'),
    router = express.Router(),
    bookController = require('../controllers/bookController');


// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/create', bookController.bookСreateGet);

router.get('/', bookController.bookList);

router.get('/:id', bookController.bookDetail);



// POST request for creating Book.
router.post('/create', bookController.bookCreatePost);

// GET request to delete Book.
router.get('/:id/delete', bookController.book_delete_get);

// POST request to delete Book.
router.post('/:id/delete', bookController.book_delete_post);

// GET request to update Book.
router.get('/:id/update', bookController.book_update_get);

// POST request to update Book.
router.post('/:id/update', bookController.book_update_post);


module.exports = router;