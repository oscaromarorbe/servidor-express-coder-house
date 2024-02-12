const { readFile } = require('./utils/readFile.js')
const { isNullOrUndefined } = require('./utils/isNullOrUndefined.js')

class ProductManager {
  #nextId
  #products
  #productDirPath
  #productsFilePath
  #fileSystem

  constructor () {
    ;(this.#products = []),
      (this.#productDirPath = './files'),
      (this.#productsFilePath = this.#productDirPath + '/Products.json'),
      (this.#fileSystem = require('fs'))
  }

  async addProduct (
    title,
    description,
    code,
    price,
    stock,
    category,
    status = true,
    thumbnails = []
  ) {
    const args = [title, description, code, price, stock, category]
    for (let i = 0; i < args.length - 1; i++) {
      if (isNullOrUndefined(args[i])) {
        return 'One or more arguments are not defined, \nPlease add missing arguments to the call \ntitle, description, code, price, stock, category'
      }
    }
    if (typeof price === 'string') price = Number(price)
    if (typeof price !== 'number' && typeof price !== 'string')
      return 'price argument must be a number'
    if (typeof stock === 'string') stock = Number(stock)
    if (typeof stock !== 'number' && typeof stock !== 'string')
      return 'stock argument must be a number'
    if (typeof status === 'string') status = status === 'true' ? true : false
    if (typeof status !== 'boolean') return 'status must be a boolean'
    if (!Array.isArray(thumbnails)) return 'thumbnails must be an array'
    const product = {
      id: crypto.randomUUID(),
      title,
      description,
      code,
      price,
      stock,
      category,
      status,
      thumbnails
    }

    try {
      this.#products = await readFile(
        this.#fileSystem,
        this.#productDirPath,
        this.#productsFilePath
      )
      this.#products.push(product)
      await this.#fileSystem.promises.writeFile(
        this.#productsFilePath,
        JSON.stringify(this.#products, null, 2, '\t')
      )
      return this.#products[this.#products.length - 1]
    } catch (err) {
      throw Error('Product not added', err)
    }
  }

  async getProducts () {
    try {
      this.#products = await readFile(
        this.#fileSystem,
        this.#productDirPath,
        this.#productsFilePath
      )
      return this.#products
    } catch (err) {
      throw Error('Something went wrong, try again', err)
    }
  }

  async getProductById (id) {
    let found = 'Not found'
    try {
      this.#products = await readFile(
        this.#fileSystem,
        this.#productDirPath,
        this.#productsFilePath
      )
      found = this.#products.find(item => item.id == id)
      return found
    } catch (err) {
      throw Error('No product found', err)
    }
  }

  async updateProduct (pid, updatedProduct = {}) {
    pid = Number(pid)
    const allowedKeys = [
      'title',
      'description',
      'code',
      'price',
      'stock',
      'category',
      'status',
      'thumbnails'
    ]
    let newProduct = {}
    for (const [key, value] of Object.entries(updatedProduct)) {
      if (allowedKeys.includes(key)) {
        newProduct = { ...newProduct, [key]: value }
      }
    }
    if (Object.keys(newProduct).length < 1)
      return 'One or more keys in product are not correct'
    const { price, stock, status, thumbnails } = newProduct
    if (!isNullOrUndefined(price)) {
      if (typeof price === 'string') newProduct.price = Number(price)
      if (typeof price !== 'number' && typeof price !== 'string')
        return 'price must be a number'
    }
    if (!isNullOrUndefined(stock)) {
      if (typeof price === 'string') newProduct.stock = Number(stock)
      if (typeof price !== 'number' && typeof stock !== 'string')
        return 'stock must be a number'
    }
    if (!isNullOrUndefined(status)) {
      if (typeof status === 'string') status = status === 'true' ? true : false
      if (typeof status !== 'boolean') return 'status must be a boolean'
      newProduct.status = status
    }
    if (!isNullOrUndefined(thumbnails)) {
      if (!Array.isArray(thumbnails)) {
        return 'thumbnails must be an array'
      }
    }

    try {
      this.#products = await readFile(
        this.#fileSystem,
        this.#productDirPath,
        this.#productsFilePath
      )
      const arr = this.#products
      const indexFound = arr.map(product => product.id).indexOf(pid)
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
      throw Error('No product found', err)
    }
  }

  async deleteProduct (pid) {
    try {
      this.#products = await readFile(
        this.#fileSystem,
        this.#productDirPath,
        this.#productsFilePath
      )
      const arr = this.#products
      const indexFound = arr.map(product => product.id).indexOf(pid)
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
      throw Error('No product found', err)
    }
  }
}

module.exports = { ProductManager }
