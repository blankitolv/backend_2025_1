// terceros
const { v4: uuidv4 } = require("uuid");

// nativas
const fs = require("fs/promises");
const path = require("path");


const DB_FILE = path.join(__dirname,"..","database", "productos.json");
class ProductManager {
  constructor() {
    this.archivo_database = DB_FILE;
    this.products = [];
    this.montarDatabase();
  }
  static generarUuid() {
    return uuidv4();
  }
  async dumpProductsToJson() {
    await fs.writeFile(
      this.archivo_database,
      JSON.stringify(this.products, null, 2),
      "utf-8"
    );
  }
  async deleteProduct(id) {
    try {
      const producto = this.getProductById(id);
      producto.status = false;
      this.dumpProductsToJson();
      return true;
    } catch (error) {
      console.log("ocurrio un error");
      return false;
    }
  }
  async getProductById(id) {
    return this.products.find((one) => one.id == id);
  }
  async getProducts() {
    return this.products;
  }
  async updateProduct(product) {
    const original_product = await this.getProductById(product.id)
    Object.keys(product).forEach(eachKey => {
      if (eachKey != "id") {
        original_product[eachKey] = product[eachKey]
      }
    });
    try {
      await this.dumpProductsToJson()
      return original_product
    } catch (error) {
      console.log(error)
      return
    }
  }
  async createProduct(
    title,
    description,
    code,
    status = true,
    stock = 0,
    category,
    thumbnail = ""
  ) {
    const product = {
      id: "p" + ProductManager.generarUuid(),
      title,
      description,
      code,
      status,
      stock,
      category,
      thumbnail,
    };
    this.products.push(product);
    this.dumpProductsToJson();
    return product
  }

  async montarDatabase() {
    try {
      // consulto si tengo acceso, sino sale por catch y resuelvo
      await fs.access(this.archivo_database);

      // #existe el archivo
      // leo el archivo y lo pongo en memoria
      const data = await fs.readFile(this.archivo_database, "utf-8");
      this.products = JSON.parse(data || []);
    } catch (error) {
      // el archivo no existe, lo creo y coloco un array vacío en memoria
      if (error.code === "ENOENT") {
        this.products = [];
        this.dumpProductsToJson();
      } else {
        console.error("error al montar la base de datos de productos.", error);
      }
    }
  }
}

const pm = new ProductManager();
module.exports = pm;
