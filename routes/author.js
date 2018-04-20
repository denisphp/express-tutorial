var express = require('express'),
    router = express.Router(),
    authorController = require('../controllers/authorController');


// GET request for list of all Authors.
router.get('/', authorController.authorList);

// GET request for one Author.
router.get('/:id', authorController.authorDetail);

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/create', authorController.author_create_get);

// POST request for creating Author.
router.post('/create', authorController.author_create_post);

// GET request to delete Author.
router.get('/:id/delete', authorController.author_delete_get);

// POST request to delete Author.
router.post('/:id/delete', authorController.author_delete_post);

// GET request to update Author.
router.get('/:id/update', authorController.author_update_get);

// POST request to update Author.
router.post('/:id/update', authorController.author_update_post);


module.exports = router;
