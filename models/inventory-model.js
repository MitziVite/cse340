const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}




/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  async function getVehicleByDataId(type_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        WHERE i.inv_id = $1`,
        [type_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }


  async function addClassification(classificationName) {
    try {
        const sql = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
        const result = await pool.query(sql, [classificationName]);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

  module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByDataId, addClassification};