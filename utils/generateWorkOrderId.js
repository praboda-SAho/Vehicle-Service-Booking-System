// Generates a work order ID in the same format shown on the front-end ticket,
// e.g. WO-482913
const generateWorkOrderId = () => {
  const random = Math.floor(100000 + Math.random() * 899999);
  return `WO-${random}`;
};

module.exports = generateWorkOrderId;
