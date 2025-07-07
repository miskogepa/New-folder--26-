const express = require("express");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

/**
 * Generiši JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

/**
 * POST /api/auth/register
 * Registracija novog korisnika
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;

    // Validacija obaveznih polja
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Sva obavezna polja moraju biti popunjena",
      });
    }

    // Proveri da li korisnik već postoji
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Korisnik sa ovim email-om ili korisničkim imenom već postoji",
      });
    }

    // Kreiraj novog korisnika
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
    });

    // Generiši token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Korisnik je uspešno registrovan",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          joinDate: user.joinDate,
        },
        token,
      },
    });
  })
);

/**
 * POST /api/auth/login
 * Prijava korisnika
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validacija
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email i lozinka su obavezni",
      });
    }

    // Dohvati korisnika sa password poljem
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Neispravni podaci za prijavu",
      });
    }

    // Proveri da li je korisnik aktivan
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Nalog je deaktiviran",
      });
    }

    // Proveri lozinku
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Neispravni podaci za prijavu",
      });
    }

    // Generiši token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Uspešna prijava",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          joinDate: user.joinDate,
        },
        token,
      },
    });
  })
);

/**
 * GET /api/auth/me
 * Dohvati trenutnog korisnika
 */
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  })
);

/**
 * PUT /api/auth/profile
 * Ažuriraj profil korisnika
 */
router.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, bio, location, phone } = req.body;

    // Polja koja se mogu ažurirati
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (bio !== undefined) updateFields.bio = bio;
    if (location !== undefined) updateFields.location = location;
    if (phone !== undefined) updateFields.phone = phone;

    // Ažuriraj korisnika
    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profil je uspešno ažuriran",
      data: {
        user,
      },
    });
  })
);

/**
 * PUT /api/auth/change-password
 * Promena lozinke
 */
router.put(
  "/change-password",
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Trenutna i nova lozinka su obavezni",
      });
    }

    // Dohvati korisnika sa password poljem
    const user = await User.findById(req.user._id).select("+password");

    // Proveri trenutnu lozinku
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Trenutna lozinka nije ispravna",
      });
    }

    // Ažuriraj lozinku
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Lozinka je uspešno promenjena",
    });
  })
);

/**
 * POST /api/auth/logout
 * Odjava korisnika (opciono - token se invalidira na frontend-u)
 */
router.post(
  "/logout",
  protect,
  asyncHandler(async (req, res) => {
    // U realnoj aplikaciji, možete dodati token u blacklist
    // Za sada, samo vraćamo uspešan odgovor
    res.json({
      success: true,
      message: "Uspešna odjava",
    });
  })
);

module.exports = router;
