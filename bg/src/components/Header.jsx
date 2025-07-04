import React from "react";
import BlurText from "./BlurText";
import { motion } from "framer-motion";
import logo from "../assets/cars/logo.jpg";

function Header() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <header className="bg-gray-500  py-8 ">
      <div className="container mx-auto px-4 flex justify-center items-center ">
        <motion.img
          src={logo}
          alt="Bela griva logo"
          className="h-20 w-60 rounded-full shadow-lg  "
          initial={{ filter: "blur(10px)", opacity: 0, y: -50 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
    </header>
  );
}

export default Header;
