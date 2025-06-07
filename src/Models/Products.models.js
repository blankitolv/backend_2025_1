import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  code: String,
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
