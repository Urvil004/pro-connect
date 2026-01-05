const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 2600,
    },
    headline: {
      type: String,
      default: "",
      maxlength: 220,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // ✅ NEW: Banner/Cover Image
    bannerImage: {
      type: String,
      default: "",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: "",
    },
    // ✅ UPDATED: Skills as array of strings
    skills: {
      type: [String],
      default: [],
    },
    // ✅ UPDATED: Experience as array of objects
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          required: true,
        },
        endDate: {
          type: String,
          default: "",
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
        },
        employmentType: {
          type: String,
          enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", ""],
          default: "",
        },
      },
    ],
    // ✅ UPDATED: Education as array of objects
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          required: true,
        },
        endDate: {
          type: String,
          default: "",
        },
        currentlyStudying: {
          type: Boolean,
          default: false,
        },
        grade: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    // ✅ NEW: Projects
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        link: {
          type: String,
          default: "",
        },
        image: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        technologies: {
          type: [String],
          default: [],
        },
      },
    ],
    // ✅ NEW: Certifications
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        issuingOrganization: {
          type: String,
          required: true,
        },
        issueDate: {
          type: String,
          required: true,
        },
        expirationDate: {
          type: String,
          default: "",
        },
        credentialId: {
          type: String,
          default: "",
        },
        credentialUrl: {
          type: String,
          default: "",
        },
        doesNotExpire: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // ✅ NEW: Licenses
    licenses: [
      {
        name: {
          type: String,
          required: true,
        },
        issuingOrganization: {
          type: String,
          required: true,
        },
        issueDate: {
          type: String,
          required: true,
        },
        expirationDate: {
          type: String,
          default: "",
        },
        credentialId: {
          type: String,
          default: "",
        },
        credentialUrl: {
          type: String,
          default: "",
        },
      },
    ],
    // ✅ NEW: Languages
    languages: [
      {
        name: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          enum: ["Elementary", "Limited Working", "Professional Working", "Full Professional", "Native or Bilingual", ""],
          default: "",
        },
      },
    ],
    // ✅ NEW: Volunteer Experience
    volunteer: [
      {
        role: {
          type: String,
          required: true,
        },
        organization: {
          type: String,
          required: true,
        },
        cause: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          required: true,
        },
        endDate: {
          type: String,
          default: "",
        },
        currentlyVolunteering: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    // ✅ NEW: Publications
    publications: [
      {
        title: {
          type: String,
          required: true,
        },
        publisher: {
          type: String,
          default: "",
        },
        publicationDate: {
          type: String,
          default: "",
        },
        publicationUrl: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        authors: {
          type: [String],
          default: [],
        },
      },
    ],
    // ✅ NEW: Honors & Awards
    awards: [
      {
        title: {
          type: String,
          required: true,
        },
        issuer: {
          type: String,
          required: true,
        },
        issueDate: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    industry: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    // Connection tracking
    connectionCount: {
      type: Number,
      default: 0,
    },
    // Last active timestamp
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Add indexes for better performance
userSchema.index({ firebaseUid: 1 });
userSchema.index({ email: 1 });
userSchema.index({ name: "text", headline: "text", bio: "text" });

// Add pre-save hook for debugging
userSchema.pre("save", function (next) {
  console.log("💾 Attempting to save user:", this.email);
  next();
});

// Add post-save hook for confirmation
userSchema.post("save", function (doc) {
  console.log("✅ User saved successfully:", doc._id, doc.email);
});

// Add error handling for duplicate keys
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    console.error("❌ Duplicate key error:", error.keyValue);
    next(new Error("User with this email or Firebase UID already exists"));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
