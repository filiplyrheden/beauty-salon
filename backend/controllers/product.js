import {
    products,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById,
} from "../models/ProductModel.js";

export const showProducts = (req, res) => {
    products((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

// create calls to db here

