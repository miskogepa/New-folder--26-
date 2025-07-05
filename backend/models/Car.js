const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Autor komentara je obavezan"],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Tekst komentara je obavezan"],
    trim: true,
    maxlength: [500, "Komentar ne može biti duži od 500 karaktera"],
  },
  images: [
    {
      type: String, // URL slike
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: [true, "Vlasnik je obavezan"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model je obavezan"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Marka je obavezna"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Godina je obavezna"],
      min: [1900, "Godina mora biti nakon 1900"],
      max: [new Date().getFullYear() + 1, "Godina ne može biti u budućnosti"],
    },
    fuel: {
      type: String,
      enum: ["Benzin", "Dizel", "Hibrid", "Električni", "Gas"],
      required: [true, "Tip goriva je obavezan"],
    },
    mileage: {
      type: String,
      required: [true, "Kilometraža je obavezna"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Boja je obavezna"],
      trim: true,
    },
    condition: {
      type: String,
      enum: [
        "Kao nov",
        "Odlično",
        "Dobro",
        "Zadovoljavajuće",
        "Potrebno popravke",
      ],
      required: [true, "Stanje je obavezno"],
    },
    description: {
      type: String,
      required: [true, "Opis je obavezan"],
      trim: true,
      maxlength: [1000, "Opis ne može biti duži od 1000 karaktera"],
    },
    images: [
      {
        type: String,
        required: [true, "Bar jedna slika je obavezna"],
      },
    ],
    mainImage: {
      type: String,
      required: [true, "Glavna slika je obavezna"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true, // Dodaje createdAt i updatedAt polja
  }
);

// Index za brže pretrage
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ owner: 1 });
carSchema.index({ year: -1 });

// Virtual za puno ime automobila
carSchema.virtual("fullName").get(function () {
  return `${this.brand} ${this.model}`;
});

// Metoda za povećanje broja pregleda
carSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Metoda za lajkovanje
carSchema.methods.like = function () {
  this.likes += 1;
  return this.save();
};

// Metoda za uklanjanje lajka
carSchema.methods.unlike = function () {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Metoda za dodavanje komentara
carSchema.methods.addComment = function (author, text, images = []) {
  this.comments.push({
    author,
    text,
    images,
    createdAt: new Date(),
  });
  return this.save();
};

// Metoda za dodavanje slika u glavnu galeriju
carSchema.methods.addImages = function (newImages) {
  this.images.push(...newImages);
  return this.save();
};

// Statička metoda za pronalaženje automobila po marki
carSchema.statics.findByBrand = function (brand) {
  return this.find({ brand: new RegExp(brand, "i") });
};

// Statička metoda za pronalaženje automobila po vlasniku
carSchema.statics.findByOwner = function (owner) {
  return this.find({ owner: new RegExp(owner, "i") });
};

// Pre-save middleware za validaciju
carSchema.pre("save", function (next) {
  // Ako nema glavne slike, postavi prvu sliku kao glavnu
  if (!this.mainImage && this.images.length > 0) {
    this.mainImage = this.images[0];
  }
  next();
});

module.exports = mongoose.model("Car", carSchema);
