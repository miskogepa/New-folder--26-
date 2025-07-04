import React from "react";
import BlurText from "./BlurText";
import logo from "../assets/cars/logo.jpg";

function Header() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <header className="bg-gray-500  py-8 ">
      <div className="container mx-auto px-4 flex justify-center items-center ">
        <BlurText
          text="Bela griva"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-4xl font-bold text-center text-gray-600"
        />
      </div>
    </header>
  );
}

export default Header;
