const mongoose = require("mongoose");
const Specialty = require("../models/Specialty");

// Your full list
const medicalSpecialties = [
  "Internal Medicine",
  "Surgery",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Family Medicine",
  "Psychiatry",
  "Dermatology",
  "Ophthalmology",
  "Otorhinolaryngology (ENT)",
  "Radiology",
  "Pathology",
  "Anesthesiology",
  "Emergency Medicine",
  "Neurology",
  "Orthopedics",
  "Urology",
  "Dentistry",
  "Public Health",
  "Rehabilitation Medicine",
  "Cardiology",
  "Endocrinology",
  "Gastroenterology",
  "Hematology",
  "Nephrology",
  "Oncology",
  "Pulmonology",
  "Rheumatology",
  "Infectious Diseases",
  "Cardiothoracic Surgery",
  "Neurosurgery",
  "Plastic Surgery",
  "Vascular Surgery",
  "General Surgery",
  "Orthopedic Surgery",
  "Colorectal Surgery",
  "Transplant Surgery",
  "Maternal–Fetal Medicine",
  "Reproductive Endocrinology",
  "Gynecologic Oncology",
  "Urogynecology",
  "Child Neurology",
  "Pediatric Cardiology",
  "Pediatric Endocrinology",
  "Pediatric Hematology–Oncology",
  "Pediatric Surgery",
  "Neonatology",
  "Ophthalmic Surgery",
  "Optometry",
  "Diagnostic Radiology",
  "Interventional Radiology",
  "Nuclear Medicine",
  "Forensic Pathology",
  "Histopathology",
  "Microbiology",
  "Clinical Chemical Pathology",
  "Child and Adolescent Psychiatry",
  "Psychiatric Rehabilitation",
  "Physical Medicine and Rehabilitation",
  "Occupational Therapy",
  "Physiotherapy",
  "Sports Medicine",
  "Sleep Medicine",
  "Pain Medicine",
  "Palliative Medicine",
  "Dental Surgery",
  "Orthodontics",
  "Periodontics",
  "Prosthodontics",
  "Endodontics",
  "Oral and Maxillofacial Surgery",
  "Oral Pathology",
  "Allergy and Immunology",
  "Geriatric Medicine",
  "Biomedical Science",
  "Clinical Pharmacology",
  "Medical Genetics",
  "Preventive Medicine",
  "Critical Care Medicine",
  "Hospital Medicine",
  "Tropical Medicine",
];

const runSeeder = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bel_medical");
    console.log("DB connected");

    // Clear old data
    await Specialty.deleteMany({});
    console.log("Old specialties removed");

    // Insert fresh
    const data = medicalSpecialties.map((name) => ({ name }));
    await Specialty.insertMany(data);

    console.log("Specialties seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeder();
