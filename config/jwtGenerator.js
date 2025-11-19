const crypto = require("crypto");

// Generate a 512-bit (64-byte) random secret in hex
const jwtSecret = crypto.randomBytes(64).toString("hex");

console.log(jwtSecret);
