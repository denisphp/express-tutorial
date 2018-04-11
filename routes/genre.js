var express = require('express'),
    router = express.Router(),
    genreController = require('../controllers/genreController');


// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/create', genreController.genre_create_get);

//POST request for creating Genre.
router.post('/create', genreController.genre_create_post);

// GET request to delete Genre.
router.get('/:id/delete', genreController.genre_delete_get);

// POST request to delete Genre.
router.post('/:id/delete', genreController.genre_delete_post);

// GET request to update Genre.
router.get('/:id/update', genreController.genre_update_get);

// POST request to update Genre.
router.post('/:id/update', genreController.genre_update_post);

// GET request for one Genre.
router.get('/:id', genreController.genre_detail);

// GET request for list of all Genre.
router.get('/', genreController.genre_list);


module.exports = router;