const socket = io();

const realtime_list_products = document.getElementById(
  "realtime_list_products"
);

const addProduct = (producto) => {
  if (!producto.id || !producto.code) {
    alert("producto mal formado")
    return
  }
  console.log(".. producto", producto);
  const div = document.createElement("div");
  div.id = producto.id;
  div.className = "card col-3 m-2";
  div.style.width = "18rem";
  div.innerHTML = `
  <img src="./assets/img/ph.jpg" class="card-img-top" />
  <div class="card-body">
    <h5 class="card-title">${producto.title}</h5>
    <p> ID:   ${producto.id} </p>
    <p> CODE: ${producto.code} </p>
    <p> STOCK: ${producto.stock} </p>
    <p> CATEGORY: ${producto.category} </p>
    <p class="card-text">${producto.description}</p>
    <button class="delete-button btn btn-danger" data-id="${producto.id}">
      Eliminar
    </button>
  </div>
  `;
  realtime_list_products.appendChild(div);

  // Agregar listener al botón recién creado
  const deleteBtn = div.querySelector(".delete-button");
  deleteBtn.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("No se pudo eliminar el producto");
        return
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de red");
    }
  });
};

socket.emit("ClientNeedProducts", "dame los productos");

socket.on("del_product", async(producto) =>{
  console.log("SE ELIMINO UN PRODUCTO: ",producto)
  const card = document.getElementById(producto);
  if (card) {
    card.remove();
    console.log(`Producto con ID ${producto} eliminado del DOM`);
  }
});
socket.on("new_product", async(producto) =>{
  console.log("evento2: ",producto.product)
  addProduct(producto.product)
});

socket.on("serverSendProducts", async (productos) => {
  realtime_list_products.innerHTML = ""; // limpiar antes de agregar
  productos.forEach((producto) => addProduct(producto));
});
