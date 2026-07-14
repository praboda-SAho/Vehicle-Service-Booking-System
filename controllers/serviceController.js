const Service = require("../models/Service");

// @route GET /api/services
// Public - powers the "Select a Service" ticket grid on the front-end
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ code: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/services  (admin only)
const createService = async (req, res) => {
  try {
    const { code, name, description, price, durationMinutes } = req.body;
    const service = await Service.create({ code, name, description, price, durationMinutes });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route PUT /api/services/:id  (admin only)
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route DELETE /api/services/:id  (admin only) - soft delete
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service removed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
