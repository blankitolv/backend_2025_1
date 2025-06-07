import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import pm from "./Products.models.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;