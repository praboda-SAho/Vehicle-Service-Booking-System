const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    workOrderId: { type: String, required: true, unique: true }, // e.g. WO-482913

    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    vehicle: {
      model: { type: String, required: true, trim: true }, // e.g. Toyota Aqua
      plateNumber: { type: String, required: true, trim: true, uppercase: true },
      year: { type: Number },
    },

    services: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
        name: String, // snapshot at booking time
        price: Number, // snapshot at booking time
      },
    ],

    total: { type: Number, required: true, min: 0 },

    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true }, // e.g. "09:30 AM"

    notes: { type: String, trim: true },

    status: {
      type: String,
      enum: ["Received", "Confirmed", "In Service", "Ready", "Cancelled"],
      default: "Received",
    },

    assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
