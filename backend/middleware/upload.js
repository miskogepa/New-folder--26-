const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary konfiguracija
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage konfiguracija
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "auto-klub",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

// Multer konfiguracija
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (povećano sa 5MB)
    files: 10, // Maksimalno 10 fajlova
  },
  fileFilter: (req, file, cb) => {
    // Proveri tip fajla
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Samo slike su dozvoljene!"), false);
    }
  },
});

// Middleware za upload više slika
const uploadMultiple = upload.array("images", 10); // Maksimalno 10 slika

// Middleware za upload jedne slike
const uploadSingle = upload.single("image");

// Helper funkcija za brisanje slika
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Greška pri brisanju slike:", error);
  }
};

// Helper funkcija za brisanje više slika
const deleteMultipleImages = async (publicIds) => {
  try {
    await Promise.all(publicIds.map((publicId) => deleteImage(publicId)));
  } catch (error) {
    console.error("Greška pri brisanju slika:", error);
  }
};

module.exports = {
  upload,
  uploadMultiple,
  uploadSingle,
  deleteImage,
  deleteMultipleImages,
  cloudinary,
};
