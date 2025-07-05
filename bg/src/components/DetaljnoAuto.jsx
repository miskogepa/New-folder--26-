import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cars } from "../data/data.js";

const DetaljnoAuto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { carId } = useParams();

  // Učitaj auto po ID-u
  const car = cars.find((c) => c.id === parseInt(carId));

  if (!car) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Auto nije pronađen
          </h1>
          <button
            onClick={() => navigate("/galerija")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Nazad na galeriju
          </button>
        </div>
      </div>
    );
  }

  // Dummy slike za galeriju (kasnije će se dodati iz baze)
  const carImages = [
    car.image,
    car.image, // duplikat za demo
    car.image, // duplikat za demo
    car.image, // duplikat za demo
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBack = () => {
    navigate("/galerija");
  };

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
              src={car.image}
              alt={car.model}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Car info and description */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {car.model}
              </h1>
              <p className="text-xl text-gray-600">Vlasnik: {car.owner}</p>
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
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Galerija slika
              </h3>
              <div className="flex flex-wrap gap-4">
                {carImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden w-52 flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl cursor-pointer"
                    onClick={() => openModal(image)}
                  >
                    <img
                      src={image}
                      alt={`${car.model} - slika ${index + 1}`}
                      className="w-full h-40 object-cover"
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
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10"
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
