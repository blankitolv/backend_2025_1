const pm = require("../Models/Products.models");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("ClientNeedProducts", async (data) => {
      console.log("(ClientNeedProducts) Mensaje recibido:", data);
      socket.emit("serverSendProducts", await pm.getProducts());
    });

    // se genera desde el method DELETE product.js
    socket.on("del_product", (data) => {
      console.log("SE EMITE DEL_ ", data)
      socket.emit("del_product", data);
    });
    
    // se genera desde el method DELETE product.js
    socket.on("new_product", (product) => {
      console.log("producto creado: ",product)
      socket.emit("new_product", product);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
