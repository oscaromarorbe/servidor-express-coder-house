const { readFile } = require('./utils/readFile.js')
const { isNullOrUndefined } = require('./utils/isNullOrUndefined.js')

class CartManager {
  #nextId
  #carts
  #cartDirPath
  #cartsFilePath
  #fileSystem

  constructor () {
    ;(this.#carts = []),
      (this.#cartDirPath = './files'),
      (this.#cartsFilePath = this.#cartDirPath + '/Carts.json'),
      (this.#fileSystem = require('fs'))
  }

  async addCart () {
    const cart = {
      id: crypto.randomUUID(),
      products: []
    }

    try {
      this.#carts = await readFile(
        this.#fileSystem,
        this.#cartDirPath,
        this.#cartsFilePath
      )
      this.#carts.push(cart)
      await this.#fileSystem.promises.writeFile(
        this.#cartsFilePath,
        JSON.stringify(this.#carts, null, 2, '\t')
      )
      return this.#carts[this.#carts.length - 1]
    } catch (err) {
      throw Error('Cart not added', err)
    }
  }

  async getCartProductsById (cid) {
    if (typeof cid === 'string') cid = Number(cid)
    if (
      isNullOrUndefined(cid) ||
      (typeof cid !== 'number' && typeof cid !== 'string')
    )
      return 'cid argument must be a number'
    try {
      this.#carts = await readFile(
        this.#fileSystem,
        this.#cartDirPath,
        this.#cartsFilePath
      )
      let found = this.#carts.find(item => item.id == cid)
      return found
    } catch (err) {
      throw Error('Cart not found', err)
    }
  }

  async updateCart (cid, pid) {
    if (typeof cid === 'string') cid = Number(cid)
    if (
      isNullOrUndefined(cid) ||
      (typeof cid !== 'number' && typeof cid !== 'string')
    )
      return 'cid argument must be a number'
    if (typeof pid === 'string') pid = Number(pid)
    if (
      isNullOrUndefined(pid) ||
      (typeof pid !== 'number' && typeof pid !== 'string')
    )
      return 'pid argument must be a number'
    try {
      this.#carts = await readFile(
        this.#fileSystem,
        this.#cartDirPath,
        this.#cartsFilePath
      )
      const arr = this.#carts
      const indexFound = arr.map(cart => cart.id).indexOf(cid)
      if (indexFound < 0) return 'No id match'
      const arr2 = this.#carts[indexFound].products
      const productFound = arr2.map(product => product.id).indexOf(pid)
      if (productFound > -1) {
        this.#carts[indexFound].products[productFound].quantity++
      } else {
        this.#carts[indexFound].products.push({ id: pid, quantity: 1 })
      }
      await this.#fileSystem.promises.writeFile(
        this.#cartsFilePath,
        JSON.stringify(this.#carts)
      )
      return this.#carts[indexFound].products[
        this.#carts[indexFound].products.length - 1
      ]
    } catch (err) {
      throw Error('Product not added', err)
    }
  }
}

module.exports = { CartManager }
