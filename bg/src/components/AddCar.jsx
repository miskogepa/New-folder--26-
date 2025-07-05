import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carAPI, { uploadAPI } from "../services/api";

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    owner: "",
    model: "",
    brand: "",
    year: "",
    fuel: "",
    mileage: "",
    color: "",
    condition: "",
    description: "",
    images: [],
    mainImage: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    // Validacija veličine fajlova
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setMessage({
        type: "error",
        text: `Slike ${oversizedFiles
          .map((f) => f.name)
          .join(", ")} su prevelike. Maksimalna veličina je 10MB.`,
      });
      return;
    }

    if (files.length > 10) {
      setMessage({
        type: "error",
        text: "Možete izabrati maksimalno 10 slika.",
      });
      return;
    }

    setSelectedFiles(files);

    if (files.length > 0) {
      try {
        setUploading(true);
        setMessage({ type: "", text: "" });

        // Upload slika na Cloudinary
        const response = await uploadAPI.uploadMultiple(files);

        const imageUrls = response.data.map((img) => img.url);
        const imagePublicIds = response.data.map((img) => img.publicId);

        setUploadedImages(response.data);
        setFormData((prev) => ({
          ...prev,
          images: imageUrls,
          mainImage: imageUrls[0] || "",
        }));

        setMessage({
          type: "success",
          text: `${files.length} slika je uspešno uploadovano!`,
        });
      } catch (error) {
        console.error("Greška pri upload-u slika:", error);
        setMessage({
          type: "error",
          text: error.message || "Greška pri upload-u slika",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Validacija
      if (
        !formData.owner ||
        !formData.model ||
        !formData.brand ||
        !formData.year ||
        !formData.fuel ||
        !formData.mileage ||
        !formData.color ||
        !formData.condition ||
        !formData.description
      ) {
        throw new Error("Sva obavezna polja moraju biti popunjena");
      }

      if (formData.images.length === 0) {
        throw new Error("Dodajte bar jednu sliku automobila");
      }

      // Slanje podataka na API
      const response = await carAPI.createCar(formData);

      setMessage({
        type: "success",
        text: "Automobil je uspešno dodat!",
      });

      // Redirect na galeriju nakon 2 sekunde
      setTimeout(() => {
        navigate("/galerija");
      }, 2000);
    } catch (error) {
      console.error("Greška pri dodavanju automobila:", error);
      setMessage({
        type: "error",
        text: error.message || "Greška pri dodavanju automobila",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newUploadedImages = [...uploadedImages];

    // Obriši sliku sa Cloudinary
    if (newUploadedImages[index]) {
      uploadAPI
        .deleteImage(newUploadedImages[index].publicId)
        .catch(console.error);
    }

    newImages.splice(index, 1);
    newUploadedImages.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      mainImage: newImages[0] || "",
    }));
    setUploadedImages(newUploadedImages);
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Dodaj Svoj Auto 🚗
          </h1>

          {/* Message display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vlasnik *
                </label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Vaše ime"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marka *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="npr. BMW, Audi, Mercedes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="npr. X5, A4, C-Class"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Godina *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="1900"
                  max="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="2020"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gorivo *
                </label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Izaberi gorivo</option>
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="Hibrid">Hibrid</option>
                  <option value="Električni">Električni</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraža *
                </label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="npr. 100.000 km"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boja *
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="npr. Crna, Bela"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stanje *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Izaberi stanje</option>
                <option value="Kao nov">Kao nov</option>
                <option value="Odlično">Odlično</option>
                <option value="Dobro">Dobro</option>
                <option value="Zadovoljavajuće">Zadovoljavajuće</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis automobila *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={loading}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Opisite svoj automobil, posebnosti, modifikacije..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slike automobila *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading || uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Možete izabrati više slika (JPG, PNG, GIF). Maksimalno 10 slika,
                10MB po slici.
              </p>

              {/* Upload progress */}
              {uploading && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Upload slika...
                    </span>
                  </div>
                </div>
              )}

              {/* Image preview */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploadovane slike:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tl-lg">
                            Glavna
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || uploading}
                className={`font-semibold py-3 px-8 rounded-lg transition-colors ${
                  loading || uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Dodavanje...
                  </div>
                ) : (
                  "Dodaj Auto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
