const express = require("express");
const {
  addSpecialty,
  getSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty,
} = require("../controllers/specialtyController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/:id", authenticateUser, getSpecialtyById);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateSpecialty);

router.delete(
  "/delete/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteSpecialty
);
router.post("/add", authenticateUser, authorizeRoles("admin"), addSpecialty);
router.get("/", authenticateUser, getSpecialties);
module.exports = router;
