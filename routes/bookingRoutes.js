const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingByWorkOrder,
  getAllBookings,
  updateBookingStatus,
  assignMechanic,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking); // customer creates a work order
router.get("/my", protect, getMyBookings); // customer's own bookings
router.get("/track/:workOrderId", getBookingByWorkOrder); // public tracking by work order ID

router.get("/", protect, authorize("admin", "mechanic"), getAllBookings);
router.patch("/:id/status", protect, authorize("admin", "mechanic"), updateBookingStatus);
router.patch("/:id/assign", protect, authorize("admin"), assignMechanic);

module.exports = router;
