const { readFile } = require('./utils/readFile.js')
const { isNullOrUndefined } = require('./utils/isNullOrUndefined.js')

class ProductManager {
  #products
  #productsFilePath
  #fileSystem

  constructor () {
    ;(this.#products = []),
      (this.#productsFilePath = './Products.json'),
      (this.#fileSystem = require('fs'))
  }

  async addProduct ({
    title,
    description,
    code,
    price,
    stock,
    category,
    status = true,
    thumbnails = []
  }) {
    const args = [title, description, code, price, stock, category]
    for (let i = 0; i < args.length - 1; i++) {
      if (isNullOrUndefined(args[i])) {
        return 'One or more arguments are not defined, \nPlease add missing arguments to the call \ntitle, description, code, price, stock, category'
      }
    }

    try {
      this.#products = await readFile(this.#fileSystem, this.#productsFilePath)
      const newID =
      this.#products.length > 0
      ? this.#products[this.#products.length - 1].id + 1
      : 0
      const product = {
        id: newID,
        title,
        description,
        code,
        price,
        stock,
        category,
        status,
        thumbnails
      }
      this.#products.push(product)
      await this.#fileSystem.promises.writeFile(
        this.#productsFilePath,
        JSON.stringify(this.#products, null, 2, '\t')
      )
      return this.#products[this.#products.length - 1]
    } catch (err) {
      throw Error('Product not added\n' + err)
    }
  }

  async getProducts () {
    try {
      this.#products = await readFile(this.#fileSystem, this.#productsFilePath)
      return this.#products
    } catch (err) {
      throw Error('Something went wrong, try again\n' + err)
    }
  }

  async getProductById (id) {
    if (typeof id == 'string') id = Number(id)
    let found = 'Not found'
    try {
      this.#products = await readFile(this.#fileSystem, this.#productsFilePath)
      found = this.#products.find(item => item.id == id)
      return found
    } catch (err) {
      throw Error('No product found\n' + err)
    }
  }

  async updateProduct (pid, newProduct = {}) {
    if (typeof pid == 'string') pid = Number(pid)
    try {
      this.#products = await readFile(this.#fileSystem, this.#productsFilePath)
      const arr = this.#products.map(product => product.id)
      const indexFound = arr.indexOf(pid)
      if (indexFound < 0) return 'No id match'
      if (newProduct.thumbnails?.length > 0)
        newProduct.thumbnails = this.#products[indexFound].thumbnails.concat(
          newProduct.thumbnails
        )
      this.#products[indexFound] = {
        ...this.#products[indexFound],
        ...newProduct
      }
      await this.#fileSystem.promises.writeFile(
        this.#productsFilePath,
        JSON.stringify(this.#products)
      )
      return this.#products[indexFound]
    } catch (err) {
      throw Error('No product found\n' + err)
    }
  }

  async deleteProduct (pid) {
    if (typeof pid === 'string') pid = Number(pid)
    try {
      this.#products = await readFile(this.#fileSystem, this.#productsFilePath)
      const arr = this.#products.map(product => product.id)
      const indexFound = arr.indexOf(pid)
      if (indexFound < 0) return 'No id match'
      const productDeleted = this.#products[indexFound]
      this.#products = [
        ...this.#products.slice(0, indexFound),
        ...this.#products.slice(indexFound + 1, this.#products.length)
      ]
      await this.#fileSystem.promises.writeFile(
        this.#productsFilePath,
        JSON.stringify(this.#products)
      )
      return productDeleted
    } catch (err) {
      throw Error('No product found\n' + err)
    }
  }
}

module.exports = { ProductManager }
