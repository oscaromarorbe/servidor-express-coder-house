const { readFile } = require('./utils/readFile.js')
const { isNullOrUndefined } = require('./utils/isNullOrUndefined.js')

class CartManager {
  #carts
  #cartsFilePath
  #fileSystem

  constructor () {
    ;(this.#carts = []),
      (this.#cartsFilePath = './Carts.json'),
      (this.#fileSystem = require('fs'))
  }

  async addCart () {
    try {
      this.#carts = await readFile(this.#fileSystem, this.#cartsFilePath)
      const newID =
        this.#carts.length > 0 ? this.#carts[this.#carts.length - 1].id + 1 : 0
      const cart = {
        id: newID,
        products: []
      }
      this.#carts.push(cart)
      await this.#fileSystem.promises.writeFile(
        this.#cartsFilePath,
        JSON.stringify(this.#carts, null, 2, '\t')
      )
      return this.#carts[this.#carts.length - 1]
    } catch (err) {
      throw Error('Cart not added\n' + err)
    }
  }

  async getCartProductsById (cid) {
    if (typeof cid === 'string') cid = Number(cid)
    try {
      this.#carts = await readFile(this.#fileSystem, this.#cartsFilePath)
      let found = this.#carts.find(item => item.id == cid)
      return found
    } catch (err) {
      throw Error('Cart not found\n' + err)
    }
  }

  async updateCart (cid, pid) {
    if (typeof cid === 'string') cid = Number(cid)
    if (typeof pid === 'string') pid = Number(pid)
    try {
      this.#carts = await readFile(this.#fileSystem, this.#cartsFilePath)
      const arr = this.#carts.map(cart => cart.id)
      const indexFound = arr.indexOf(cid)
      if (indexFound < 0) return 'No id match'
      const arr2 = this.#carts[indexFound].products.map(product => product.id)
      const productFound = arr2.indexOf(pid)
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
      throw Error('Product not added\n' + err)
    }
  }
}

module.exports = { CartManager }
