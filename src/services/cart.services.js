// services/cart.service.js
import CartModel from "../models/Carts.models.js";
import ProductModel from "../models/Products.models.js";

export async function createCart(products = []) {
  for (const item of products) {
    const exist = await ProductModel.findById(item.id);
    if (!exist) throw new Error(`Producto con id ${item.id} no existe`);
  }

  const newCart = await CartModel.create({ products });
  return newCart;
}

export async function getCartById(cid) {
  return CartModel.findById(cid).populate("products.id");
}

export async function addProductToCart(cid, pid, quantity) {
  const cart = await CartModel.findById(cid);
  if (!cart) throw new Error("Carrito no encontrado");

  const existProduct = await ProductModel.findById(pid);
  if (!existProduct) throw new Error("Producto no encontrado");

  const index = cart.products.findIndex((p) => p.id.equals(pid));
  if (index !== -1) {
    cart.products[index].quantity += quantity;
  } else {
    cart.products.push({ id: pid, quantity });
  }

  await cart.save();
  return cart;
}
