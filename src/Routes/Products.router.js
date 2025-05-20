// terceros
const express = require("express");
const router = express.Router();

// propias
const pm = require("../Models/Products.models.js");

// socket
// import { socketServer } from "../app.js";

/*
  POST /api/products
  Crea un nuevo producto.
  Espera los campos: title, description, code, status, stock, category y thumbnail.
*/
router.post("/", async (req, res) => {
  const { title, description, code, status, stock, category, thumbnail } =
    req.body;
  try {
    const prod = await pm.createProduct(
      title,
      description,
      code,
      status,
      stock,
      category,
      thumbnail
    );
    res.status(200).json(prod);
    const io = req.app.get("socketio");
    io.emit("new_product", { product: prod });
  } catch (error) {
    res.status(500).send();
  }
});

/*
  GET /api/products
  Devuelve el listado completo de productos.
*/
router.get("/", async (req, res) => {
  try {
    const productos = await pm.getProducts();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).send();
  }
});

/*
  GET /api/products/:pid
  Devuelve un producto por su ID.
*/
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) return res.status(400).send();
  try {
    const oneProduct = await pm.getProductById(pid);
    if (!oneProduct) return res.status(404).send();
    res.status(200).json(oneProduct);
  } catch (error) {
    res.status(500).send();
  }
});

/*
  DELETE /api/products/:pid
  Elimina un producto por su ID.
  Si no existe, responde con error.
*/
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) return res.status(400).send();
  try {
    const valido = await pm.deleteProduct(pid);
    if (!valido) {
      res.status(400).send();
      return;
    }
    res.status(200).send();
    const io = req.app.get("socketio");
    io.emit("del_product", pid);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

/*
  PUT /api/products/:pid
  Actualiza los datos de un producto existente.
  El campo status no puede ser modificado.
  El ID del producto se sobreescribe con el de la ruta.
*/
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = req.body;

  // elimino el campo status si viene en el body
  delete product.status;

  // forzamos el ID del producto a ser el de la URL
  product.id = pid;

  if (!pid) return res.status(400).send();
  try {
    const prod = await pm.updateProduct(product);
    if (!product) return res.status(500).send();
    return res.status(200).json(prod);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
