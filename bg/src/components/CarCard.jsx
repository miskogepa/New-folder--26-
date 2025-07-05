import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TiltedCard from "./TiltedCard";

function CarCard({ car, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        className="cursor-pointer"
      >
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
