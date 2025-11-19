const Specialty = require("../models/Specialty");
exports.addSpecialty = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required." });

    const exists = await Specialty.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Specialty already exists." });

    const specialty = await Specialty.create({ name });

    res.status(201).json({
      message: "Specialty added.",
      specialty,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort("name");
    res.status(200).json({ specialties });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    await Specialty.findByIdAndDelete(id);
    res.status(200).json({ message: "Specialty removed." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
