// terceros
import { v4 as uuidv4 } from "uuid";

// nativas
import fs from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const DB_FILE = path.join(__dirname,"..","database", "productos.json");

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
