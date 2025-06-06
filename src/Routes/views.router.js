// terceros
import express from "express"
// const express = require("express");
const router = express.Router()
import pm from "../Models/Products.models.js"
// const pm = require("../Models/Products.models")

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

export default router;
// module.exports = router;