const express = require("express");
const router = express.Router();
const Car = require("../models/Car");

// GET - Svi automobili
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      owner,
      year,
      sort = "-createdAt",
    } = req.query;

    // Build filter object
    const filter = {};
    if (brand) filter.brand = new RegExp(brand, "i");
    if (owner) filter.owner = new RegExp(owner, "i");
    if (year) filter.year = parseInt(year);

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const cars = await Car.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Car.countDocuments(filter);

    res.json({
      success: true,
      data: cars,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri učitavanju automobila",
      error: error.message,
    });
  }
});

// GET - Automobil po ID-u
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Automobil nije pronađen",
      });
    }

    // Povećaj broj pregleda
    await car.incrementViews();

    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri učitavanju automobila",
      error: error.message,
    });
  }
});

// POST - Novi automobil
router.post("/", async (req, res) => {
  try {
    const {
      owner,
      model,
      brand,
      year,
      fuel,
      mileage,
      color,
      condition,
      description,
      images,
      mainImage,
    } = req.body;

    // Validacija obaveznih polja
    if (
      !owner ||
      !model ||
      !brand ||
      !year ||
      !fuel ||
      !mileage ||
      !color ||
      !condition ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Sva obavezna polja moraju biti popunjena",
      });
    }

    // Kreiraj novi automobil
    const newCar = new Car({
      owner,
      model,
      brand,
      year: parseInt(year),
      fuel,
      mileage,
      color,
      condition,
      description,
      images: images || [],
      mainImage: mainImage || (images && images.length > 0 ? images[0] : ""),
    });

    const savedCar = await newCar.save();

    res.status(201).json({
      success: true,
      message: "Automobil je uspešno dodat",
      data: savedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri dodavanju automobila",
      error: error.message,
    });
  }
});

// PUT - Ažuriranje automobila
router.put("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Automobil nije pronađen",
      });
    }

    // Ažuriraj polja
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Automobil je uspešno ažuriran",
      data: updatedCar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri ažuriranju automobila",
      error: error.message,
    });
  }
});

// DELETE - Brisanje automobila
router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Automobil nije pronađen",
      });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Automobil je uspešno obrisan",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri brisanju automobila",
      error: error.message,
    });
  }
});

// POST - Lajkovanje automobila
router.post("/:id/like", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Automobil nije pronađen",
      });
    }

    await car.like();

    res.json({
      success: true,
      message: "Automobil je lajkovan",
      data: { likes: car.likes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri lajkovanju",
      error: error.message,
    });
  }
});

// POST - Uklanjanje lajka
router.post("/:id/unlike", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Automobil nije pronađen",
      });
    }

    await car.unlike();

    res.json({
      success: true,
      message: "Lajk je uklonjen",
      data: { likes: car.likes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri uklanjanju lajka",
      error: error.message,
    });
  }
});

// GET - Pretraga automobila
router.get("/search/brand/:brand", async (req, res) => {
  try {
    const cars = await Car.findByBrand(req.params.brand);

    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri pretraživanju",
      error: error.message,
    });
  }
});

// GET - Automobili po vlasniku
router.get("/owner/:owner", async (req, res) => {
  try {
    const cars = await Car.findByOwner(req.params.owner);

    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri pretraživanju",
      error: error.message,
    });
  }
});

module.exports = router;
