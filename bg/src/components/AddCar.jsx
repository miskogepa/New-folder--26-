import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carAPI from "../services/api";

const AddCar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Za sada koristimo dummy URL-ove za slike
    // Kasnije ćeš dodati upload na Cloudinary
    const dummyImages = files.map(
      (file, index) =>
        `https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=300&fit=crop&v=${index}`
    );

    setFormData((prev) => ({
      ...prev,
      images: dummyImages,
      mainImage: dummyImages[0] || "",
    }));
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
                Slike automobila
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Možete izabrati više slika (JPG, PNG, GIF). Za sada se koriste
                dummy slike.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`font-semibold py-3 px-8 rounded-lg transition-colors ${
                  loading
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
