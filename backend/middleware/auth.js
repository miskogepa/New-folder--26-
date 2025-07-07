const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");

/**
 * Auth Middleware - Proverava JWT token i dodaje korisnika u req
 * Koristi se za zaštitu ruta koje zahtevaju autentifikaciju
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Proveri da li token postoji u headeru
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Proveri da li token postoji
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Nije dozvoljen pristup - token nije pronađen",
    });
  }

  try {
    // Verifikuj token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dohvati korisnika iz baze (bez password polja)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token nije validan - korisnik nije pronađen",
      });
    }

    // Proveri da li je korisnik aktivan
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Nalog je deaktiviran",
      });
    }

    // Dodaj korisnika u req objekat
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token nije validan",
    });
  }
});

/**
 * Role Middleware - Proverava da li korisnik ima određenu ulogu
 * Koristi se za admin rute
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Nije dozvoljen pristup - korisnik nije autentifikovan",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Korisnik sa ulogom '${req.user.role}' nema dozvolu za pristup ovom resursu`,
      });
    }

    next();
  };
};

/**
 * Optional Auth Middleware - Proverava token ako postoji, ali ne zahteva ga
 * Koristi se za rute gde je autentifikacija opciona
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Ignoriši grešku - korisnik nije obavezan da bude autentifikovan
    }
  }

  next();
});

module.exports = {
  protect,
  authorize,
  optionalAuth,
};
