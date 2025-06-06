import express from "express";
import CartModel from "../Models/Carts.models.js";
import ProductModel from "../Models/Products.models.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ error: "Se debe enviar un arreglo de productos" });
  }

  try {
    // Validar y normalizar productos
    const cleanProducts = await Promise.all(
      products.map(async (p) => {
        if (!p.id || !mongoose.Types.ObjectId.isValid(p.id)) {
          throw new Error(`ID de producto inválido: ${p.id}`);
        }

        const exist = await ProductModel.findById(p.id);
        if (!exist) {
          throw new Error(`Producto ${p.id} no existe`);
        }

        return {
          id: p.id,
          quantity: p.quantity && p.quantity > 0 ? p.quantity : 1,
        };
      })
    );

    // Crear carrito
    const newCart = new CartModel({ products: cleanProducts });
    await newCart.save();

    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    if (
      error.message.startsWith("ID de producto inválido") ||
      error.message.startsWith("Producto")
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener carrito por id con productos poblados
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }

  try {
    const cart = await CartModel.findById(cid).populate("products.id");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar o actualizar producto en carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body?.quantity > 0 ? req.body.quantity : 1;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID de producto inválido" });
  }

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existProduct = await ProductModel.findById(pid);
    if (!existProduct)
      return res.status(400).json({ error: "Producto no existe" });

    const index = cart.products.findIndex((p) => p.id.toString() === pid);
    if (index === -1) {
      cart.products.push({ id: pid, quantity });
    } else {
      cart.products[index].quantity += quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }
  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    // Vaciar el carrito
    cart.products = [];
    await cart.save();

    res.status(200).json(
      {
        message: "Todos los productos fueron eliminados del carrito",
        cart,
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar productos del carrito" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID de producto inválido" });
  }

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const index = cart.products.findIndex((p) => p.id.toString() === pid);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(index, 1);
    await cart.save();

    res.status(200).json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }

  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ error: "El cuerpo debe contener un arreglo de productos" });
  }

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    // Validar estructura de productos
    const isValidStructure = products.every(
      (p) =>
        p.id &&
        mongoose.Types.ObjectId.isValid(p.id) &&
        typeof p.quantity === "number"
    );
    if (!isValidStructure) {
      return res
        .status(400)
        .json({ error: "Formato inválido en el arreglo de productos" });
    }

    // Actualizar el carrito
    cart.products = products;
    await cart.save();

    res
      .status(200)
      .json({ message: "Productos del carrito actualizados", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(cid) ||
    !mongoose.Types.ObjectId.isValid(pid)
  ) {
    return res.status(400).json({ error: "ID de carrito o producto inválido" });
  }

  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const productInCart = cart.products.find((p) => p.id.toString() === pid);
    if (!productInCart) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    productInCart.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cantidad actualizada", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
