//mercadoPago-routes.js
const express = require("express");
const { crearPreferencia } = require("../controllers/mercadoPagoController");
const router = express.Router();




router.post("/crear-preferencia", crearPreferencia);
console.log("mercadopago-routes cargado");

module.exports = router;
 