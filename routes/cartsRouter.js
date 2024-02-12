const { CartManager } = require('../cart-manager.js')
const express = require('express')
let router = express.Router()

const cartManager = new CartManager()

router.post('/', async (request, response) => {
  const newCart = await cartManager.addCart()
  if (newCart) response.send(newCart)
})

router.get('/:cid', async (request, response) => {
  const { cid } = request.params
  const cartFound = await cartManager.getCartProductsById(cid)
  response.send(cartFound)
})

router.post('/:cid/product/:pid', async (request, response) => {
  const { cid, pid } = request.params
  const addedProduct = await cartManager.updateCart(cid, pid)
  response.send(addedProduct)
})

module.exports = router
