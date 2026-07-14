// Run with: npm run seed
// Populates the services collection with the same services shown on the
// front-end ticket grid (REVLINE UI).
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Service = require("../models/Service");

const services = [
  { code: "SRV-01", name: "Oil Change", description: "Engine oil & filter replacement", price: 3500, durationMinutes: 30 },
  { code: "SRV-02", name: "Full Service", description: "Complete inspection & tune-up", price: 12000, durationMinutes: 180 },
  { code: "SRV-03", name: "Tire Replacement", description: "New tires, balancing & alignment", price: 8000, durationMinutes: 60 },
  { code: "SRV-04", name: "Brake Check", description: "Pads, discs & fluid inspection", price: 4500, durationMinutes: 45 },
  { code: "SRV-05", name: "AC Service", description: "Gas refill & cooling system check", price: 5000, durationMinutes: 60 },
  { code: "SRV-06", name: "Battery Check", description: "Load test & terminal cleaning", price: 1500, durationMinutes: 20 },
];

const run = async () => {
  await connectDB();
  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log("Services seeded successfully");
  process.exit();
};

run();
