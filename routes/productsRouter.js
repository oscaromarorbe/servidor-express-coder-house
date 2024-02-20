const { ProductManager } = require('../product-manager.js')
const express = require('express')
let router = express.Router()

const productManager = new ProductManager()

router.get('/', async (request, response) => {
  const products = await productManager.getProducts()
  const { limit } = request.query
  if (limit > 0 && limit < products.length) products = products.slice(0, limit)
  response.send({ products })
})

router.get('/:pid', async (request, response) => {
  const { pid } = request.params
  const productFound = await productManager.getProductById(pid)
  response.send(productFound)
})

router.post('/', async (request, response) => {
  const newProduct = await productManager.addProduct(request.body)
  if (newProduct) response.send(newProduct)
})

router.put('/:pid', async (request, response) => {
  const { pid } = request.params
  const newProduct = await productManager.updateProduct(pid, request.body)
  response.send(newProduct)
})

router.delete('/:pid', async (request, response) => {
  const productDeleted = await productManager.deleteProduct(request.params.pid)
  response.send(productDeleted)
})

module.exports = router
