import React, { useState } from "react";
import { Link } from "react-router-dom";
import carAPI from "../services/api";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

const CarCard = ({ car, onDelete }) => {
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

  const handleDelete = async () => {
    showConfirmDialog(async () => {
      try {
        await carAPI.deleteCar(car._id);
        showNotification("Automobil je uspešno obrisan!");
        if (onDelete) {
          onDelete(car._id);
        }
      } catch (error) {
        console.error("Greška pri brisanju automobila:", error);
        showNotification("Greška pri brisanju automobila", "error");
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
        {/* Main image */}
        <div className="relative h-48">
          <img
            src={car.mainImage || car.images?.[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Slika+nije+dostupna";
            }}
          />
          {/* Delete button overlay */}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
            title="Obriši automobil"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Car info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600 mb-4">Vlasnik: {car.owner}</p>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500">Godina</span>
              <p className="font-medium">{car.year}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Gorivo</span>
              <p className="font-medium">{car.fuel}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Kilometraža</span>
              <p className="font-medium">{car.mileage}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Boja</span>
              <p className="font-medium">{car.color}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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

          {/* Action buttons */}
          <div className="flex gap-2">
            <Link
              to={`/auto/${car._id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
            >
              Detalji
            </Link>
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

export default CarCard;
