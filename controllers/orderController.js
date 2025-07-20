const Order = require("../models/OrderModels");

const getOrderById = async (req, res) => {
  const { preferenceId } = req.params;

  try {
    const order = await Order.findOne({ mpPreferenceId: preferenceId });
    if (!order) {
      return res.json({
        message: "No se encontro la orden",
        status: 404,
      });
    }
    return res.json({
      order,
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOrderById,
};