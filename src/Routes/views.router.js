// terceros
const express = require("express");
const router = express.Router()

const pm = require("../Models/Products.models")

router.get('/', async(req , res)=>{
  try {
    const prods = await pm.getProducts()
    console.log("se envía: ", prods)
    res.render('home', {productos: prods})
  } catch (error) {
    console.log(error)
  }
})
router.get('/realtimeproducts', async(req , res)=>{
  try {
    const prods = await pm.getProducts()
    console.log("se envía: ", prods)
    res.render('realtimeproducts', {})
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;