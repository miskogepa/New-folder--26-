import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "./TiltedCard";
import carAPI from "../services/api";

function CarCard({ car, onClick, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Koristi mainImage ili prvu sliku iz niza
  const imageSrc =
    car.mainImage ||
    (car.images && car.images.length > 0 ? car.images[0] : null);

  const handleCardClick = () => {
    if (onClick) {
      onClick(car);
    } else {
      // Default navigacija na detaljnu stranicu
      navigate(`/auto/${car._id || car.id}`);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Sprečava otvaranje detaljne stranice

    if (
      window.confirm(
        "Da li ste sigurni da želite da obrišete ovaj automobil? Ova akcija se ne može poništiti."
      )
    ) {
      try {
        setIsDeleting(true);
        await carAPI.deleteCar(car._id || car.id);

        // Pozovi callback funkciju za ažuriranje liste
        if (onDelete) {
          onDelete(car._id || car.id);
        } else {
          // Ako nema callback, osveži stranicu
          window.location.reload();
        }

        alert("Automobil je uspešno obrisan!");
      } catch (error) {
        console.error("Greška pri brisanju automobila:", error);
        alert("Greška pri brisanju automobila. Pokušajte ponovo.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        className="cursor-pointer relative"
      >
        {/* Delete button overlay */}
        {isHovered && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Obriši automobil"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
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
            )}
          </button>
        )}

        <TiltedCard
          imageSrc={imageSrc}
          altText={`${car.owner} - ${car.brand} ${car.model}`}
          captionText={`${car.owner} - ${car.brand} ${car.model}`}
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <div className="p-4 text-black bg-amber-300 bg-opacity-80 rounded-lg">
              <h3 className="text-lg font-bold">
                {car.brand} {car.model}
              </h3>
              {isHovered && (
                <>
                  <p className="text-sm mb-2">Vlasnik: {car.owner}</p>
                  <p className="text-sm mb-2">Godina: {car.year}</p>
                  <p className="text-sm">Gorivo: {car.fuel}</p>
                </>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default CarCard;
