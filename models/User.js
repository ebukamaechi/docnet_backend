const mongoose = require("mongoose");

// const medicalSpecialties = [
//   "Internal Medicine",
//   "Surgery",
//   "Pediatrics",
//   "Obstetrics and Gynecology",
//   "Family Medicine",
//   "Psychiatry",
//   "Dermatology",
//   "Ophthalmology",
//   "Otorhinolaryngology (ENT)",
//   "Radiology",
//   "Pathology",
//   "Anesthesiology",
//   "Emergency Medicine",
//   "Neurology",
//   "Orthopedics",
//   "Urology",
//   "Dentistry",
//   "Public Health",
//   "Rehabilitation Medicine",

//   "Cardiology",
//   "Endocrinology",
//   "Gastroenterology",
//   "Hematology",
//   "Nephrology",
//   "Oncology",
//   "Pulmonology",
//   "Rheumatology",
//   "Infectious Diseases",

//   "Cardiothoracic Surgery",
//   "Neurosurgery",
//   "Plastic Surgery",
//   "Vascular Surgery",
//   "General Surgery",
//   "Orthopedic Surgery",
//   "Colorectal Surgery",
//   "Transplant Surgery",

//   "Maternal–Fetal Medicine",
//   "Reproductive Endocrinology",
//   "Gynecologic Oncology",
//   "Urogynecology",

//   "Child Neurology",
//   "Pediatric Cardiology",
//   "Pediatric Endocrinology",
//   "Pediatric Hematology–Oncology",
//   "Pediatric Surgery",
//   "Neonatology",

//   "Ophthalmic Surgery",
//   "Optometry",

//   "Diagnostic Radiology",
//   "Interventional Radiology",
//   "Nuclear Medicine",

//   "Forensic Pathology",
//   "Histopathology",
//   "Microbiology",
//   "Clinical Chemical Pathology",

//   "Child and Adolescent Psychiatry",
//   "Psychiatric Rehabilitation",

//   "Physical Medicine and Rehabilitation",
//   "Occupational Therapy",
//   "Physiotherapy",

//   "Sports Medicine",
//   "Sleep Medicine",
//   "Pain Medicine",
//   "Palliative Medicine",

//   "Dental Surgery",
//   "Orthodontics",
//   "Periodontics",
//   "Prosthodontics",
//   "Endodontics",
//   "Oral and Maxillofacial Surgery",
//   "Oral Pathology",

//   "Allergy and Immunology",

//   // Additional useful specialties
//   "Geriatric Medicine",
//   "Biomedical Science",
//   "Clinical Pharmacology",
//   "Medical Genetics",
//   "Preventive Medicine",
//   "Critical Care Medicine",
//   "Hospital Medicine",
//   "Tropical Medicine",
// ];

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    specialty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
      // enum: medicalSpecialties,
      // default: "Internal Medicine",
    },
    bio: { type: String },
    profileImage: {
      //url is the direct link to the image on cloudinary
      url: { type: String, default: "" },
      //public_id is what you use to overwrite on cloudinary for deleting or replacing.
      public_id: { type: String, default: "" },
    },

    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },

    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },

    rank: { type: Number, default: 0 },
    badges: [
      {
        type: String,
        enum: ["newbie", "intermediate", "expert", "moderator"],
        default: "newbie",
      },
    ],

    socialLinks: {
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },

    //chat metrics, i'll come back to this
    unreadMessages: {
      type: Map, //key = conversationId
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
