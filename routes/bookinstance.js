var express = require('express'),
    router = express.Router(),
    bookinstanceController = require('../controllers/bookinstanceController');


// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/create', bookinstanceController.bookinstanceCreateGet);

router.get('/', bookinstanceController.bookinstanceList);

router.get('/:id', bookinstanceController.bookinstanceDetail);


// POST request for creating BookInstance.
router.post('/create', bookinstanceController.bookinstanceCreatePost);

// GET request to delete BookInstance.
router.get('/:id/delete', bookinstanceController.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/:id/delete', bookinstanceController.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/:id/update', bookinstanceController.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/:id/update', bookinstanceController.bookinstance_update_post);


module.exports = router;