const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities/');

router.get('/add', utilities.checkJWTToken, reviewController.buildAddReview);
router.post('/add', utilities.checkJWTToken, reviewController.addReview);

router.get('/update/:reviewId', utilities.checkJWTToken, reviewController.buildUpdateReview);
router.post('/update', utilities.checkJWTToken, reviewController.updateReview);

router.get('/delete/:reviewId', utilities.checkJWTToken, reviewController.buildDeleteReview);
router.post('/delete', utilities.checkJWTToken, reviewController.deleteReview);

module.exports = router;
