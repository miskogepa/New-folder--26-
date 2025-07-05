import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import carAPI, { handleAPIError } from "../services/api";

const DetaljnoAuto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const { carId } = useParams();

  // Učitaj auto po ID-u iz API-ja
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carAPI.getCarById(carId);
        console.log("Detalji automobila:", response);
        setCar(response.data);
      } catch (err) {
        console.error("Greška pri učitavanju automobila:", err);
        setError(err.message || "Automobil nije pronađen");
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBack = () => {
    navigate("/galerija");
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await carAPI.unlikeCar(carId);
        setCar((prev) => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await carAPI.likeCar(carId);
        setCar((prev) => ({ ...prev, likes: prev.likes + 1 }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Greška pri lajkovanju:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Učitavanje automobila...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Automobil nije pronađen"}
          </h1>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Nazad na galeriju
          </button>
        </div>
      </div>
    );
  }

  // Koristi prave slike iz baze
  const carImages =
    car.images && car.images.length > 0 ? car.images : [car.mainImage];

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Nazad na galeriju
        </button>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Main image */}
          <div className="relative h-96">
            <img
              src={car.mainImage || car.images?.[0]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            {/* Like button overlay */}
            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-current" : "text-gray-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Car info and description */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-600">Vlasnik: {car.owner}</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {car.views || 0} pregleda
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {car.likes || 0} lajkova
                </div>
              </div>
            </div>

            {/* Specifications grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Specifikacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marka:</span>
                    <span className="font-medium">{car.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Godina:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gorivo:</span>
                    <span className="font-medium">{car.fuel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dodatne informacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kilometraža:</span>
                    <span className="font-medium">{car.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Boja:</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stanje:</span>
                    <span className="font-medium">{car.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dodato:</span>
                    <span className="font-medium">
                      {new Date(car.createdAt).toLocaleDateString("sr-RS")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Opis</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {car.description}
              </p>
            </div>

            {/* Image gallery */}
            {carImages && carImages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Galerija slika ({carImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {carImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl cursor-pointer"
                      onClick={() => openModal(image)}
                    >
                      <img
                        src={image}
                        alt={`${car.brand} ${car.model} - slika ${index + 1}`}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Slika+nije+dostupna";
                        }}
                      />
                      <div className="py-3 text-center">
                        <span className="block text-gray-500 text-sm">
                          Slika {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for full size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Velika slika"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetaljnoAuto;
