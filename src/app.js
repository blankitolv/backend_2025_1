// librería de terceros
const express = require("express");
// nativa
const path = require("path");
// propias
const productRouter = require("./Routes/Products.router.js")
const cartRouter = require("./Routes/Carts.router.js")

const app = express();


const PORT = 8087;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)

app.get('/', async (req, res )=>{
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Cuchando desde el puerto: ${PORT}`);
});
