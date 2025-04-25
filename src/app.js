// librería de terceros
const express = require("express");

const app = express();

const productRouter = require("./Routes/Products.router.js")
const cartRouter = require("./Routes/Carts.router.js")

const PORT = 8087;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)

app.listen(PORT, () => {
  console.log(`Cuchando desde el puerto: ${PORT}`);
});
