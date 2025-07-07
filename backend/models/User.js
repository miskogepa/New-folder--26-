const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Korisničko ime je obavezno"],
      unique: true,
      trim: true,
      minlength: [3, "Korisničko ime mora imati najmanje 3 karaktera"],
      maxlength: [30, "Korisničko ime ne može biti duže od 30 karaktera"],
    },
    email: {
      type: String,
      required: [true, "Email je obavezan"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Molimo unesite validan email",
      ],
    },
    password: {
      type: String,
      required: [true, "Lozinka je obavezna"],
      minlength: [6, "Lozinka mora imati najmanje 6 karaktera"],
      select: false, // Ne vraća lozinku u upitima
    },
    firstName: {
      type: String,
      required: [true, "Ime je obavezno"],
      trim: true,
      maxlength: [50, "Ime ne može biti duže od 50 karaktera"],
    },
    lastName: {
      type: String,
      required: [true, "Prezime je obavezno"],
      trim: true,
      maxlength: [50, "Prezime ne može biti duže od 50 karaktera"],
    },
    avatar: {
      type: String,
      default: "", // URL slike profila
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Dodatna polja za budućnost
    bio: {
      type: String,
      maxlength: [500, "Bio ne može biti duži od 500 karaktera"],
    },
    location: {
      type: String,
      maxlength: [100, "Lokacija ne može biti duža od 100 karaktera"],
    },
    phone: {
      type: String,
      maxlength: [20, "Telefon ne može biti duži od 20 karaktera"],
    },
  },
  {
    timestamps: true, // Dodaje createdAt i updatedAt polja
  }
);

// Virtual za puno ime
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual za inicijale (za avatar placeholder)
userSchema.virtual("initials").get(function () {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Pre-save middleware za hash lozinke
userSchema.pre("save", async function (next) {
  // Hash lozinku samo ako je promenjena
  if (!this.isModified("password")) return next();

  try {
    // Hash lozinku sa salt factor 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metoda za proveru lozinke
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Metoda za dohvatanje osnovnih podataka (bez password)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Statička metoda za pronalaženje korisnika po email-u
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Statička metoda za pronalaženje korisnika po username-u
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Indeksi za brže pretrage
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
