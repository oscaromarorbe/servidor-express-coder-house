const persistProducts = async (productManager) => {
  await productManager.addProduct('soap', 'hand soap', 'soap', 5, 2, 'bathroom', true, ['image'])
  await productManager.addProduct('toothbrush', 'blue toothbrush', 'toothbrush', 7, 4, 'toothbrush')
  await productManager.addProduct('toothpaste', 'green toothpaste', 'toothpaste', 9, 5, 'toothpaste')
  await productManager.addProduct('shampoo', 'hair shampoo', 'shampoo', 11, 6, 'shampoo', false, ['image'])
  await productManager.addProduct('towel', 'big towel', 'towel', 13, 7, 'towel')
  console.log(await productManager.getProducts())
}

module.exports = { persistProducts }
