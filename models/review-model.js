const pool = require('../database/');

async function createReview(reviewText, invId, accountId) {
    try {
        const sql = `INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(sql, [reviewText, invId, accountId]);
        console.log('Create Review Result:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
}

// Función para obtener revisiones por ID de inventario
async function getReviewsByInventoryId(invId) {
    const sql = `SELECT review_id, review_text, review_date, account.account_id, account.account_firstname, account.account_lastname FROM review JOIN account ON review.account_id = account.account_id  WHERE inv_id = $1 ORDER BY review_date DESC`;
    console.log(sql, invId);
    const result = await pool.query(sql, [invId]);
    return result.rows;
}

// review-model.js
async function getReviewByReviewId(reviewId) {
    try {
        const sql = `SELECT * FROM public.review WHERE review_id = $1`;
        const result = await pool.query(sql, [reviewId]);
        return result.rows[0];
    } catch (error) {
        console.error("getReviewByReviewId error: " + error);
    }
}

// Función para obtener revisiones por ID de cuenta
async function getReviewsByAccountId(accountId) {
    const sql = `SELECT * FROM review WHERE account_id = $1 ORDER BY review_date DESC`;
    const result = await pool.query(sql, [accountId]);
    return result.rows;
}

// Función para actualizar una revisión
async function updateReview(reviewId, reviewText) {
    console.log({reviewId, reviewText})
    const sql = `UPDATE review SET review_text = $1, review_date = now() WHERE review_id = $2 RETURNING *`;
    const result = await pool.query(sql, [reviewText, reviewId]);

    console.log(result);
    return result.rows[0];
}

// Función para eliminar una revisión
async function deleteReview(reviewId) {
    const sql = `DELETE FROM review WHERE review_id = $1 RETURNING *`;
    const result = await pool.query(sql, [reviewId]);
    return result.rows[0];
}

// Exportar funciones
module.exports = {
    createReview,
    getReviewsByInventoryId,
    getReviewsByAccountId,
    updateReview,
    deleteReview,
    getReviewByReviewId
};
