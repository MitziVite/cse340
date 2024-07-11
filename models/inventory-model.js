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



async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
  inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `
      INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
        inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
      inv_thumbnail, inv_price, inv_miles, inv_color];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("addInventory error: " + error);
    throw new Error(error);
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventory(inv_id, classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = `
      UPDATE public.inventory
      SET classification_id = $1, inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10
      WHERE inv_id = $11
      RETURNING *
    `;
    const values = [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("updateInventory error: " + error);
    throw new Error(error);
  }
}




  module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByDataId, addClassification, addInventory};