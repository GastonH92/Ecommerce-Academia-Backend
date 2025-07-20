// controllers/mercadoPagoController.js
require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Order = require("../models/OrderModels");

// 1) Configurás el SDK con tu token
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  // opcional: timeout, host, etc.
});

// 2) Instanciás el manejador de preferencias
const preferenceClient = new Preference(mpConfig);

const crearPreferencia = async (req, res) => {
  const { userName, products } = req.body;
  if (!userName || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "userName y products son obligatorios" });
  }

  try {
    // 3) Mapeo de items al formato que espera Mercado Pago
    const items = products.map(p => ({
      title:      p.title,
      quantity:   p.quantity || 1,
      unit_price: p.price,
      currency_id:"ARS",
    }));

    // 4) Llamás al método create() de la instancia Preference
    const result = await preferenceClient.create({
      body: {
        items,
        back_urls: {
          success: "https://opriksoftware.com/payments/success",
          failure: "https://opriksoftware.com/payments/failed",
          pending: "https://opriksoftware.com/payments/pending",
        },
        auto_return: "approved",
      }
    });
    console.log("<<< MPI RESPONSE >>>", JSON.stringify(result, null, 2));

    const { id, init_point } = result;

    // 5) Guardás la orden en tu base de datos
    const total = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);

    await Order.create({
      userName,
      products: products.map(p => ({
        productId: p.productId || null,
        title:     p.title,
        price:     p.price,
        quantity:  p.quantity || 1,
      })),
      total,
      mpPreferenceId: id,
      status: "pending",
    });

    // 6) Respondés al cliente
    return res.json({ init_point, preferenceId: id });

  } catch (error) {
    console.error("Error creando preferencia:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { crearPreferencia };
