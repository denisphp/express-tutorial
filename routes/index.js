var express = require('express'),
    router = express.Router(),
    indexController = require('../controllers/indexController');


router.get('/', indexController.index);

module.exports = router;
