import db from "../config/database.js";

export const products = (result) => {
    db.query("SELECT * FROM Products", (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
}

// Get Product by ID
export const getProductById = (id, result) => {
    db.query("SELECT * FROM Products WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results[0]);  // Assuming `id` is unique and you'll get a single product
        }
    });
};

// Create New Product
export const createProduct = (data, result) => {
    db.query("INSERT INTO Products SET ?", data, (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, { id: results.insertId, ...data });  // Returning the newly inserted product with ID
        }
    });
};

// Update Product by ID
export const updateProductById = (id, data, result) => {
    db.query("UPDATE Products SET ? WHERE id = ?", [data, id], (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, { id: id, ...data });
        }
    });
};

// Delete Product by ID
export const deleteProductById = (id, result) => {
    db.query("DELETE FROM Products WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, { message: "Product deleted successfully!" });
        }
    });
};

