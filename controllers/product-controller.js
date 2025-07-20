const Product = require('../models/ProductModels');
const cloudinary = require('../configs/cloudinary');
const streamifier = require('streamifier');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

const postProduct = async (req, res) => {
  try {
    const { title, description, price, category, featured, stock } = req.body;
    const files = req.files;

    if (!title || !description || !price || !featured || !stock) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes' });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const uploadPromises = files.map((file) => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newProduct = new Product({
      title,
      description,
      price,
      slug,
      category,
      featured,
      stock,
      images: results
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al subir producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: `No se encontró el producto con el id ${id}` });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, featured, stock } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, category, slug, featured, stock, price },
      { new: true }
    );

    res.status(200).json({
      message: 'Producto actualizado con éxito',
      product: updatedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: `No se encontró el producto con el id ${id}` });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany();
    res.status(200).json({
      message: `${result.deletedCount} productos eliminados.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar los productos' });
  }
};

module.exports = {
  getAllProducts,
  postProduct,
  deleteProduct,
  getProductById,
  editProduct,
  deleteAllProducts
};
