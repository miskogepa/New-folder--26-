import { useState } from "react";
import CarGallery from "./components/CarGallery";
import Header from "./components/Header";
import Hyperspeed from "./Hyperspeed";

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Pozadina */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Hyperspeed />
      </div>
      {/* Overlay sadržaj */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4">
          <CarGallery />
        </main>
      </div>
    </div>
  );
}

export default App;
