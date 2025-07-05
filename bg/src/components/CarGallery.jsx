import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import carAPI, { handleAPIError } from "../services/api";

const CarGallery = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitaj automobile iz API-ja
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carAPI.getAllCars();
        console.log("Dobijeni automobili:", response);
        setCars(response.data || []);
      } catch (err) {
        console.error("Greška pri učitavanju automobila:", err);
        setError(err.message || "Greška pri učitavanju automobila");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Funkcija za brisanje automobila iz liste
  const handleDeleteCar = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-12">
        <h2 className="text-3xl font-bold mb-8 text-left pl-8">
          Automobili članova
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Učitavanje automobila...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full py-12">
        <h2 className="text-3xl font-bold mb-8 text-left pl-8">
          Automobili članova
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (cars.length === 0) {
    return (
      <div className="w-full py-12">
        <h2 className="text-3xl font-bold mb-8 text-left pl-8">
          Automobili članova
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🚗</div>
            <p className="text-gray-600 mb-4">Još nema automobila u galeriji</p>
            <button
              onClick={() => navigate("/dodaj-auto")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Dodaj prvi auto
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <h2 className="text-3xl font-bold mb-8 text-left pl-8">
        Automobili članova ({cars.length})
      </h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {cars.map((car) => (
          <CarCard
            car={car}
            key={car._id || car.id}
            onDelete={handleDeleteCar}
          />
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
