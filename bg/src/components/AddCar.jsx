import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carAPI, { uploadAPI } from "../services/api";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    fuel: "",
    mileage: "",
    color: "",
    condition: "",
    owner: "",
    description: "",
    mainImage: null,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const showConfirmDialog = (action) => {
    setConfirmDialog({ isOpen: true, action });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validacija veličine fajla
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showNotification(
          `Slika ${file.name} je prevelika. Maksimalna veličina je 10MB.`,
          "warning"
        );
        return;
      }
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
      }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Validacija veličine fajlova
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      showNotification(
        `Slike ${oversizedFiles
          .map((f) => f.name)
          .join(", ")} su prevelike. Maksimalna veličina je 10MB.`,
        "warning"
      );
      return;
    }

    if (files.length > 5) {
      showNotification("Možete izabrati maksimalno 5 slika.", "warning");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    showConfirmDialog(async () => {
      try {
        setLoading(true);
        setUploadingImages(true);

        // Upload glavne slike
        let mainImageUrl = "";
        if (formData.mainImage) {
          const mainImageResponse = await uploadAPI.uploadSingle(
            formData.mainImage
          );
          mainImageUrl = mainImageResponse.data.url;
        }

        // Upload dodatnih slika
        let additionalImageUrls = [];
        if (formData.images.length > 0) {
          const imagesResponse = await uploadAPI.uploadMultiple(
            formData.images
          );
          additionalImageUrls = imagesResponse.data.map((img) => img.url);
        }

        // Kombinuj sve slike
        const allImages = [mainImageUrl, ...additionalImageUrls].filter(
          Boolean
        );

        // Kreiraj automobil
        const carData = {
          ...formData,
          mainImage: mainImageUrl,
          images: allImages,
        };

        // Ukloni file objekte iz podataka
        delete carData.mainImage;
        delete carData.images;

        const response = await carAPI.createCar(carData);
        console.log("Automobil kreiran:", response);

        showNotification("Automobil je uspešno dodat!");
        setTimeout(() => {
          navigate("/galerija");
        }, 1500);
      } catch (error) {
        console.error("Greška pri dodavanju automobila:", error);
        showNotification("Greška pri dodavanju automobila", "error");
      } finally {
        setLoading(false);
        setUploadingImages(false);
      }
    });
  };

  const handleReset = () => {
    showConfirmDialog(() => {
      setFormData({
        brand: "",
        model: "",
        year: "",
        fuel: "",
        mileage: "",
        color: "",
        condition: "",
        owner: "",
        description: "",
        mainImage: null,
        images: [],
      });
      showNotification("Forma je resetovana", "info");
    });
  };

  return (
    <>
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Dodaj novi automobil
            </h1>
            <p className="text-gray-600">
              Podelite svoj automobil sa drugim entuzijastima
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. BMW, Mercedes, Audi..."
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. X5, C-Class, A4..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Godina proizvodnje *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. 2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vrsta goriva *
                  </label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Izaberite gorivo</option>
                    <option value="Benzin">Benzin</option>
                    <option value="Dizel">Dizel</option>
                    <option value="Hibrid">Hibrid</option>
                    <option value="Električni">Električni</option>
                    <option value="Gas">Gas</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. 150.000 km"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. Crna, Bela, Siva..."
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Izaberite stanje</option>
                    <option value="Odlično">Odlično</option>
                    <option value="Dobro">Dobro</option>
                    <option value="Srednje">Srednje</option>
                    <option value="Potrebno popravke">Potrebno popravke</option>
                  </select>
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Vaše ime"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opis *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Opisite svoj automobil, modifikacije, servis, itd."
                />
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glavna slika *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maksimalna veličina: 10MB
                </p>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dodatne slike (opciono)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maksimalno 5 slika, 10MB po slici
                </p>
              </div>

              {/* Image preview */}
              {formData.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pregled dodatnih slika
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || uploadingImages}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Dodavanje...
                    </>
                  ) : (
                    "Dodaj automobil"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  Resetuj
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/galerija")}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg transition-colors"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={hideConfirmDialog}
        onConfirm={confirmDialog.action}
        title="Potvrda akcije"
        message="Da li ste sigurni da želite da nastavite sa ovom akcijom?"
        confirmText="Potvrdi"
        cancelText="Otkaži"
        type="info"
      />
    </>
  );
};

export default AddCar;
