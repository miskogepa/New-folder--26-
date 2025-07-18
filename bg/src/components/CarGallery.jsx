import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "./TiltedCard";
import carAPI from "../services/api";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

const CarGallery = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carAPI.getAllCars();
      console.log("Učitani automobili:", response);
      setCars(response.data);
    } catch (err) {
      console.error("Greška pri učitavanju automobila:", err);
      setError(err.message || "Greška pri učitavanju automobila");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    showConfirmDialog(async () => {
      try {
        await carAPI.deleteCar(carId);
        // Ukloni automobil iz liste
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        showNotification("Automobil je uspešno obrisan!");
      } catch (error) {
        console.error("Greška pri brisanju automobila:", error);
        showNotification("Greška pri brisanju automobila", "error");
      }
    });
  };

  const handleCarClick = (car) => {
    navigate(`/auto/${car._id}`);
  };

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

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Greška pri učitavanju
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCars}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-gray-400 text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Nema automobila
          </h1>
          <p className="text-gray-600 mb-6">
            Trenutno nema automobila u galeriji. Budite prvi koji će dodati svoj
            automobil!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Galerija automobila
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <div
                key={car._id}
                className="flex flex-col items-center space-y-4 p-6 group"
              >
                <div
                  className="cursor-pointer relative w-[300px] h-[220px]"
                  onClick={() => handleCarClick(car)}
                >
                  <TiltedCard
                    imageSrc={
                      car.mainImage ||
                      car.images?.[0] ||
                      "https://via.placeholder.com/400x300?text=Slika+nije+dostupna"
                    }
                    altText={`${car.owner} - ${car.brand} ${car.model}`}
                    captionText={`${car.owner} - ${car.brand} ${car.model}`}
                    containerHeight="220px"
                    containerWidth="300px"
                    imageHeight="220px"
                    imageWidth="300px"
                    rotateAmplitude={12}
                    scaleOnHover={1.2}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="p-3 bg-amber-300 text-black rounded-xl shadow font-sans min-w-[150px]">
                          <h3 className="text-lg font-bold mb-1">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-sm">Vlasnik: {car.owner}</p>
                        </div>
                      </div>
                    }
                  />
                </div>
                {/* Car info below the card */}
                <div className="text-center">
                  {/* Stats */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
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
                      {car.views || 0}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
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
                      {car.likes || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        title="Brisanje automobila"
        message="Da li ste sigurni da želite da obrišete ovaj automobil? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        cancelText="Otkaži"
        type="danger"
      />
    </>
  );
};

export default CarGallery;
