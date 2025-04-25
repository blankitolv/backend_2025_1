// terceros
const express = require("express");
const router = express.Router();

// propias
const cm = require("../Models/Carts.models.js");

/*
  POST /api/cart
  Crea un nuevo carrito con una lista de productos.
  Si no se especifica cantidad o es 0, se asigna 1 por defecto.
*/
router.post("/", async (req, res) => {
  const [ ...products ] = req.body;
  
  if (!products || products.length == 0) return res.status(400).send();

  // se normalizan los productos, si el producto está sin quantity o con
  // quantity == 0, se coloca un 1.
  const cleanProducts = products.map((one) => {
    if (one.quantity === 0 || one.quantity === undefined) {
      return { ...one, quantity: 1 };
    }
    return one;
  });

  try {
    const cart = await cm.createCart(cleanProducts);
    if (!cart) return res.status(400).send()
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).send();
  }
});


/*
  GET /api/cart/:cid
  Obtiene un carrito por su ID.
*/
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  if (!cid) return res.status(400).send();
  try {
    const oneCart = await cm.getCartById(cid);
    if (!oneCart) return res.status(400).send();
    res.status(200).json(oneCart);
  } catch (error) {
    res.status(500).send();
  }
});

/*
  POST /api/cart/:cid/product/:pid
  Agrega un producto al carrito.
  Si no se especifica cantidad, se asume 1.
*/
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // si no manda body o no manda quantity es 1
  let quantity = req.body?.quantity;
  if (!quantity || quantity <= 0) quantity = 1;

  if (!cid || !pid) return res.status(400).send();

  try {
    const oneCart = await cm.addProductToCart(pid, cid, quantity);
    if (!oneCart) return res.status(400).send();
    res.status(200).json(oneCart);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
