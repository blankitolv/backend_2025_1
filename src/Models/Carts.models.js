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