import React from "react";
import TiltedCard from "./TiltedCard";
import bmwImage from "../assets/cars/bmw.jpg";

// Sample car data
const cars = [
  {
    id: 1,
    owner: "Marko Petrović",
    model: "BMW X5",
    image: bmwImage,
  },
  {
    id: 2,
    owner: "Ana Jovanović",
    model: "Mercedes C-Class",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    owner: "Stefan Nikolić",
    model: "Audi A4",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    owner: "Jelena Đorđević",
    model: "Volkswagen Golf",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    owner: "Milan Stojanović",
    model: "Toyota Camry",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    owner: "Sara Marković",
    model: "Honda Civic",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=300&fit=crop",
  },
];

const CarGallery = () => {
  return (
    <div className="w-full py-8">
      <h2 className="text-3xl font-bold mb-8 text-left pl-8">
        Automobili članova
      </h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {cars.map((car) => (
          <TiltedCard
            key={car.id}
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
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-[15px]">
                <p className="font-semibold text-lg">{car.owner}</p>
                <p className="text-sm opacity-90">{car.model}</p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
