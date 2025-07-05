const express = require("express");
const router = express.Router();
const {
  uploadMultiple,
  uploadSingle,
  deleteImage,
} = require("../middleware/upload");
const multer = require("multer");

// Error handling middleware za multer greške
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Slika je prevelika. Maksimalna veličina je 10MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Previše slika. Maksimalno 10 slika je dozvoljeno.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Neočekivani fajl. Proverite imena polja.",
      });
    }
  }

  if (err.message === "Samo slike su dozvoljene!") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next(err);
};

// POST - Upload više slika
router.post("/multiple", (req, res, next) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Nema slika za upload",
        });
      }

      const uploadedImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
      }));

      res.json({
        success: true,
        message: "Slike su uspešno uploadovane",
        data: uploadedImages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Greška pri upload-u slika",
        error: error.message,
      });
    }
  });
});

// POST - Upload jedne slike
router.post("/single", (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Nema slike za upload",
        });
      }

      const uploadedImage = {
        url: req.file.path,
        publicId: req.file.filename,
        originalName: req.file.originalname,
      };

      res.json({
        success: true,
        message: "Slika je uspešno uploadovana",
        data: uploadedImage,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Greška pri upload-u slike",
        error: error.message,
      });
    }
  });
});

// DELETE - Brisanje slike
router.delete("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;

    await deleteImage(publicId);

    res.json({
      success: true,
      message: "Slika je uspešno obrisana",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri brisanju slike",
      error: error.message,
    });
  }
});

module.exports = router;
