import React from "react";
import BlurText from "./BlurText";

function Header() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <BlurText
          text="Bela griva"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-4xl font-bold text-center text-gray-800"
        />
      </div>
    </header>
  );
}

export default Header;
