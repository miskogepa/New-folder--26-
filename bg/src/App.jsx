import { useState } from "react";
import CarGallery from "./components/CarGallery";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-gray-50  ">
      <Header />
      <main className="container mx-auto px-4">
        <CarGallery />
      </main>
    </div>
  );
}

export default App;
