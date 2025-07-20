//OrderModels.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: String,
      title:     String,
      price:     Number,
      quantity:  Number,
    },
  ],
  total: Number,
  mpPreferenceId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
