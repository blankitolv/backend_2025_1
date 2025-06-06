import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import Sockets from "./socket/socket.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import connectDB from "./config/database.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// const { Server } = require("socket.io")

// const Sockets = require("./socket/socket")

// Módulos propios
// ─────────────────────────────


import productRouter from "./Routes/Products.router.js";
import cartRouter from "./Routes/Carts.router.js";
import viewsRouter from "./Routes/views.router.js";




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
const httpServer = http.createServer(app); // <--- Acá NO escuchamos todavía

// const httpServer = app.listen(PORT, () => {
//   console.log(`Escuchando desde el puerto: ${PORT}`);
// });

const socketServer = new Server(httpServer);

app.set('socketio',socketServer);
Sockets(socketServer);



// Conexión a la DB y luego levantar el servidor
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ No se pudo conectar a MongoDB:", err);
  process.exit(1);
});