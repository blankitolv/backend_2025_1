// terceros
const { v4: uuidv4 } = require("uuid");

// nativas
const fs = require("fs/promises");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "database", "carts.json");

class CartManager {
  constructor() {
    this.archivo_database = DB_FILE;
    this.carts = [];
    this.montarDatabase();
  }
  // genera un UUID para los carritos
  static generarUuid() {
    return uuidv4();
  }

  // guarda el contenido actual de los carritos en el archivo JSON
  async dumpCartsToJson() {
    await fs.writeFile(
      this.archivo_database,
      JSON.stringify(this.carts, null, 2),
      "utf-8"
    );
  }
  async getCartById(id) {
    return this.carts.find((one) => one.id == id);
  }

  
  async createCart(products) {
    const id = "c" + CartManager.generarUuid();
    const cart = { id, products };
    this.carts.push(cart);
    this.dumpCartsToJson();
    return cart;
  }

  async addProductToCart(pid, cid, quantity) {
    try {
      const cart = await this.getCartById(cid);
      if (!cart) throw new Error("carrito no existe");
      const product = cart.products.find((one) => one.id == pid);
      if (!product) {
        cart.products.push({ id: pid, quantity });
      } else {
        product.quantity += quantity;
      }
      await this.dumpCartsToJson();
      return cart;
    } catch (error) {
      return;
    }
  }

  async montarDatabase() {
    try {
      // consulto si tengo acceso, sino sale por catch y resuelvo
      await fs.access(this.archivo_database);

      // #existe el archivo
      // leo el archivo y lo pongo en memoria
      const data = await fs.readFile(this.archivo_database, "utf-8");
      this.carts = JSON.parse(data || []);
    } catch (error) {
      // el archivo no existe, lo creo y coloco un array vacío en memoria
      if (error.code === "ENOENT") {
        this.carts = [];
        this.dumpCartsToJson();
      } else {
        console.error(
          "error al montar la base de datos de carritos de compras.",
          error
        );
      }
    }
  }
}

const cm = new CartManager();
module.exports = cm;
