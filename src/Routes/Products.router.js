// terceros
import express from "express";
const router = express.Router();

// propias
import ProductModel from "../Models/Products.models.js";
import mongoose from "mongoose";

router.post("/", async (req, res) => {
  const { title, description, code, status, stock, category, thumbnail, price } =
    req.body;

  if (!title || !description || !code || stock === undefined || !category) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const newProduct = new ProductModel({
      title,
      description,
      code,
      status: status ?? true,
      stock,
      category,
      thumbnail,
      price,
    });

    await newProduct.save();

    res.status(200).json(newProduct);

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
    //queryparams con valores por defecto
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : null;

    let filter = {};
    const allowedFilters = ["category", "status", "stock", "title"];

    allowedFilters.forEach((key) => {
      if (req.query[key] !== undefined) {
        // convertir "true"/"false" a booleanos y números si corresponde
        const value = req.query[key];
        if (value === "true") {
          filter[key] = true;
        } else if (value === "false") {
          filter[key] = false;
        } else if (!isNaN(value)) {
          filter[key] = Number(value);
        } else {
          filter[key] = value;
        }
      }
    });

    // Construir la consulta
    const totalDocs = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;

    let productsQuery = ProductModel.find(filter).skip(skip).limit(limit);
    if (sort !== null) {
      console.log("ordenando por: ",sort)
      productsQuery = productsQuery.sort({ price: sort });
    }

    const products = await productsQuery.exec();

    res.status(200).json({
      status: "success",
      totalDocs,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      payload: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

/*
  GET /api/products/:pid
  Devuelve un producto por su ID.
*/
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const oneProduct = await ProductModel.findById(pid);
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

  if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const deleted = await ProductModel.findByIdAndDelete(pid);
    if (!deleted)
      return res.status(404).json({ error: "Producto no encontrado" });
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
  if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ error: "ID inválido" });
  }


  const product = req.body;

  // elimino el campo status si viene en el body
  delete product.status;

  // forzamos el ID del producto a ser el de la URL
  product.id = pid;

  if (!pid) return res.status(400).send();
  try {
    delete product.status;
    const updated = await ProductModel.findByIdAndUpdate(pid, product, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

export default router;
