const express = require('express');
const {getOrderById} = require('../controllers/orderController');
const router = express.Router();

router.get('/get/:preferenceId', getOrderById);

module.exports = router;
