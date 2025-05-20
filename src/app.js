// de terceros
// ─────────────────────────────
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const http = require("http");



const app = express();
const { Server } = require("socket.io")

const Sockets = require("./socket/socket")

// Módulos propios
// ─────────────────────────────

const productRouter = require("./Routes/Products.router");
const cartRouter = require("./Routes/Carts.router");
const viewsRouter = require("./Routes/views.router");

// Middleware
// ─────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// servers (http/websocket)
const PORT = 8087;
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando desde el puerto: ${PORT}`);
});

const socketServer = new Server(httpServer);

app.set('socketio',socketServer);
Sockets(socketServer);