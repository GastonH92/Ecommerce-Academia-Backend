//server.js
require('dotenv').config()
const express = require('express');
const connection = require('./database/connection');
const cors = require("cors");
const productsRouter = require('./routes/product-routes');
const userRoutes = require('./routes/user-routes');
const paymentsRouter = require('./routes/mercadopago-routes');
const orderRoutes = require('./routes/order-routes');
const mercadopago = require("mercadopago");

connection(); // Conectar a la base de datos MongoDB

const app = express();

app.get('/', (req, res) => {
    res.send('Hola API');
    });



    app.use (express.json());
    app.use(cors());

    app.use("/api/products", productsRouter);

    app.use("/api/users", userRoutes);

    app.use("/api/payments/mp", paymentsRouter);
    app.use("/api/orders", orderRoutes);


    const port = 8080;





    app.listen(port, () => {
        console.log(`Servidor escuchando en puerto: ${port}`);
    });