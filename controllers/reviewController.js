// reviewController.js
const inventoryModel = require('../models/inventory-model');
const reviewModel = require('../models/review-model');
const utilities = require('../utilities/');



async function getInventoryWithReviews(req, res) {
    try {
        const type_id = req.params.typeId;

        console.log({type_id, message: 'prueba'})
        // Obtener inventarios de la base de datos
        // const inventories = await inventoryModel.getInventoriesByType(typeId);
        const data = await inventoryModel.getVehicleByDataId(type_id);
        const inventories = await utilities.buildVehicleGrid(data);
        let nav = await utilities.getNav();

        console.log({ inventories, data });

        if (inventories.length === 0) {
            throw new Error('No inventories found for the given type ID');
        }

        const reviews = await reviewModel.getReviewsByInventoryId(data[0].inv_id);

        
        // Obtener detalles del inventario y reseñas para la vista de detalle
        const invDetails = inventories[0];  // Ejemplo: tomar el primer inventario
        // const reviews = invDetails ? invDetails.reviews : [];  // Aquí aseguramos que reviews tenga un valor
        const vehicleInfo = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model;

        // Imprimir reviews para depuración
        console.log('Reviews:', reviews);

        // Renderizar la vista y pasar los datos
        res.render('inventory/info', {
            title: vehicleInfo,
            nav,
            grid: inventories,
            invDetails: data[0],
            reviews: reviews, // Asegúrate de que reviews esté incluido aquí
        });
    } catch (error) {
        console.error('Error loading inventory data:', error.message);
        res.status(500).send('Error loading inventory data');
    }
}


// Build add review view
async function buildAddReview(req, res, next) {
    try {
        let nav = await utilities.getNav();

        res.render('inventory/detail', {
            title: 'Add New Review',
            nav,
            messages: req.flash()
        });
    } catch (error) {
        next(error);
    }
}

// Build update review view
async function buildUpdateReview(req, res, next) {
    try {
        const review_id = req.params.reviewId;
        const review = await reviewModel.getReviewByReviewId(review_id);

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/account/admin');
        }

        let nav = await utilities.getNav();

        res.render('review/update', {
            title: 'Update Review',
            nav,
            review,
            messages: req.flash()
        });
    } catch (error) {
        next(error);
    }
}

// Build delete review view
async function buildDeleteReview(req, res, next) {
    try {
        const review_id = req.params.reviewId;
        const review = await reviewModel.getReviewByReviewId(review_id);

        if (!review) {
            req.flash('error', 'Review not found.');
            return res.redirect('/account/admin');
        }

        let nav = await utilities.getNav();

        res.render('review/delete', {
            title: 'Delete Review',
            nav,
            review,
            messages: req.flash()
        });
    } catch (error) {
        next(error);
    }
}

// Función para añadir una revisión
async function addReview(req, res) {
    try {
        const { reviewText, invId, accountId } = req.body;
        console.log('Review Data:', { reviewText, invId, accountId });

        const review = await reviewModel.createReview(reviewText, invId, accountId);
        if (review) {
            req.flash('notice', 'Review added successfully.');
        } else {
            req.flash('error', 'Failed to add review.');
        }
        res.redirect(`/inv/detail/${invId}`);
    } catch (error) {
        console.error('Error adding review:', error);
        req.flash('error', 'Failed to add review due to an internal error.');
        res.redirect(`/inv/detail/${req.body.invId}`);
    }
}

// Función para actualizar una revisión
async function updateReview(req, res) {
    const { review_id, review_text } = req.body;
    const review = await reviewModel.updateReview(review_id, review_text);
    if (review) {
        req.flash('notice', 'Review updated successfully.');
    } else {
        req.flash('error', 'Failed to update review.');
    }
    res.redirect('/account/admin');
}

// Función para eliminar una revisión
async function deleteReview(req, res) {
    const { review_id } = req.body;
    const review = await reviewModel.deleteReview(review_id);
    if (review) {
        req.flash('notice', 'Review deleted successfully.');
    } else {
        req.flash('error', 'Failed to delete review.');
    }
    res.redirect('/account/admin');
}

module.exports = {
    getInventoryWithReviews,
    addReview,
    updateReview,
    deleteReview,
    buildAddReview,
    buildUpdateReview,
    buildDeleteReview
};
