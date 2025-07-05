import { useState } from "react";
import CarGallery from "./components/CarGallery";
import DetaljnoAuto from "./components/DetaljnoAuto";
import Header from "./components/Header";
import Hyperspeed from "./Hyperspeed";

function App() {
  const [selectedCar, setSelectedCar] = useState(null);

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const handleBack = () => {
    setSelectedCar(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-500">
      {/* Pozadina */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <Hyperspeed />
      </div>
      {/* Overlay sadržaj */}
      <div className="relative z-10 ">
        <Header />
        <main className="container mx-auto px-4">
          {selectedCar ? (
            <DetaljnoAuto car={selectedCar} onBack={handleBack} />
          ) : (
            <CarGallery onCarClick={handleCarClick} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
