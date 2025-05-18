// librería de terceros
const express = require("express");
const { engine } = require("express-handlebars");
// nativa
const path = require("path");
// propias
const productRouter = require("./Routes/Products.router");
const cartRouter = require("./Routes/Carts.router");
const viewsRouter = require("./Routes/views.router");

const PORT = 8087;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Configuración de handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.listen(PORT, () => {
  console.log(`Cuchando desde el puerto: ${PORT}`);
});
