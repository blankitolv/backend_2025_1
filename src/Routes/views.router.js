// terceros
const express = require("express");
const router = express.Router()

const pm = require("../Models/Products.models")

router.get('/', async(req , res)=>{
  try {
    const prods = await pm.getProducts()
    console.log("se envía: ", prods)
    res.render('productos', {productos: prods})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;