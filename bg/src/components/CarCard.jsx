import React, { useState } from "react";
import TiltedCard from "./TiltedCard";

function CarCard({ car }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
      >
        <TiltedCard
          imageSrc={car.image}
          altText={`${car.owner} - ${car.model}`}
          captionText={`${car.owner} - ${car.model}`}
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
              <h3 className="text-lg font-bold">{car.model}</h3>
              {isHovered && (
                <>
                  <p className="text-sm mb-2">Vlasnik: {car.owner}</p>
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
