import React from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";
import { cars } from "../data/data.js";

const CarGallery = () => {
  const navigate = useNavigate();

  const handleCarClick = (car) => {
    navigate(`/auto/${car.id}`);
  };

  return (
    <div className="w-full py-12">
      <h2 className="text-3xl font-bold mb-8 text-left pl-8">
        Automobili članova
      </h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} onClick={handleCarClick} />
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
