const Booking = require("../models/Booking");
const Service = require("../models/Service");
const generateWorkOrderId = require("../utils/generateWorkOrderId");

// @route POST /api/bookings  (logged-in customer)
// Body: { vehicle: {model, plateNumber, year}, serviceIds: [...], preferredDate, preferredTime, notes }
const createBooking = async (req, res) => {
  try {
    const { vehicle, serviceIds, preferredDate, preferredTime, notes } = req.body;

    if (!vehicle?.model || !vehicle?.plateNumber || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: "Vehicle, date and time are required" });
    }
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ message: "Select at least one service" });
    }

    // Snapshot service name & price at time of booking (so later price changes
    // don't alter historical work orders)
    const services = await Service.find({ _id: { $in: serviceIds }, active: true });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ message: "One or more selected services are invalid" });
    }

    const lineItems = services.map((s) => ({ service: s._id, name: s.name, price: s.price }));
    const total = lineItems.reduce((sum, item) => sum + item.price, 0);

    // Ensure a unique work order ID (retry on the rare collision)
    let workOrderId;
    do {
      workOrderId = generateWorkOrderId();
    } while (await Booking.findOne({ workOrderId }));

    const booking = await Booking.create({
      workOrderId,
      customer: req.user._id,
      vehicle,
      services: lineItems,
      total,
      preferredDate,
      preferredTime,
      notes,
      status: "Received",
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings/my  (logged-in customer's own bookings)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("services.service", "code name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings/:workOrderId  (track a specific work order)
const getBookingByWorkOrder = async (req, res) => {
  try {
    const booking = await Booking.findOne({ workOrderId: req.params.workOrderId })
      .populate("customer", "name phone")
      .populate("assignedMechanic", "name")
      .populate("services.service", "code name");
    if (!booking) return res.status(404).json({ message: "Work order not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings  (admin/mechanic - all bookings, optional ?status=)
const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .populate("customer", "name phone email")
      .populate("assignedMechanic", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/bookings/:id/status  (admin/mechanic)
// Body: { status: "Confirmed" | "In Service" | "Ready" | "Cancelled" }
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Received", "Confirmed", "In Service", "Ready", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/bookings/:id/assign  (admin only)
// Body: { mechanicId }
const assignMechanic = async (req, res) => {
  try {
    const { mechanicId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedMechanic: mechanicId },
      { new: true }
    ).populate("assignedMechanic", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingByWorkOrder,
  getAllBookings,
  updateBookingStatus,
  assignMechanic,
};
