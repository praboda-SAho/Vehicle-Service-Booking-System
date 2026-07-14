const express = require("express");
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getServices); // public - feeds the service ticket grid
router.post("/", protect, authorize("admin"), createService);
router.put("/:id", protect, authorize("admin"), updateService);
router.delete("/:id", protect, authorize("admin"), deleteService);

module.exports = router;
