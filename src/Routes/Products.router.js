// terceros
const express = require("express");
const router = express.Router()

// propias
const pm = require("../Models/Products.models.js")


router.post("/", async (req, res) => {
  const { title, description, code, status, stock, category, thumbnail } = req.body;
  try {
    const prod = await pm.createProduct(title, description, code, status, stock, category, thumbnail);
    res.status(200).json(prod);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/", async (req, res) => {
  try {
    const productos = await pm.getProducts();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).send();
  }
});

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

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) return res.status(400).send();
  try {
    const valido = await pm.deleteProduct(pid);
    !valido ? res.status(400).send() : res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.put("/:pid", async (req,res)=>{
  const { pid } = req.params;
  const product = req.body;
  
  // elimino el status si es que lo envió
  delete product.status;

  // le coloco el id (y si envió otro, lo piso)
  product.id = pid

  if (!pid) return res.status(400).send();
  try {
    const prod = await pm.updateProduct(product)
    if (!product) return res.status(500).send();
    return res.status(200).json(prod)
  } catch (error) {
    console.log(error)
    return res.status(500).send();
  }
})

module.exports = router;