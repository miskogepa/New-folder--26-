import React from "react";
import CarCard from "./CarCard";
import { cars } from "../data/data.js";

const CarGallery = () => {
  return (
    <div className="w-full py-12">
      <div className="flex flex-wrap gap-6 justify-center">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </div>
  );
};

export default CarGallery;
