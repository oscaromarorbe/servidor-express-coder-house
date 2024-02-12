const productsRoute = require('./routes/productsRouter')
const cartsRoute = require('./routes/cartsRouter')

const express = require('express')
const app = express()

const PORT = 8080

app.use(express.json())

app.use('/products', productsRoute)

app.use('/carts', cartsRoute)

app.listen(PORT, () => {
  console.log('Listen on the port ' + PORT)
})
