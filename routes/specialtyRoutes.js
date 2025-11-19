const express = require("express");
const {
  addSpecialty,
  getSpecialties,
  deleteSpecialty,
} = require("../controllers/specialtyController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();
router.delete("/delete/:id", authenticateUser, authorizeRoles("admin"), deleteSpecialty);
router.post("/add", authenticateUser, authorizeRoles("admin"), addSpecialty);
router.get("/", authenticateUser, getSpecialties);
module.exports = router;
