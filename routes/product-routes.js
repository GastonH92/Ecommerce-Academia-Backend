const express = require('express');
const router = express.Router(); 

const { 
  getAllProducts, 
  postProduct, 
  deleteProduct, 
  getProductById, 
  editProduct, 
  deleteAllProducts 
} = require('../controllers/product-controller');
const upload = require('../configs/multer');


router.get('/get', getAllProducts);
router.get('/get/:id', getProductById);
router.post('/post', upload.array('images', 5), postProduct);
router.put('/edit/:id', upload.none(), editProduct);
router.delete('/delete/:id', deleteProduct);
router.delete('/deleteAll', deleteAllProducts);


module.exports = router;