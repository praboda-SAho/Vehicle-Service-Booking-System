const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. SRV-01
    name: { type: String, required: true, trim: true }, // e.g. Oil Change
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // in LKR
    durationMinutes: { type: Number, required: true, min: 1 }, // e.g. 30
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
