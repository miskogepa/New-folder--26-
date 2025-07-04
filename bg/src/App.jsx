import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import CarGallery from "./components/CarGallery";
import DetaljnoAuto from "./components/DetaljnoAuto";
import HomePage from "./components/HomePage";
import AddCar from "./components/AddCar";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Hyperspeed from "./Hyperspeed";

// Wrapper komponenta za DetaljnoAuto da može da pristupi URL parametrima
const DetaljnoAutoWrapper = () => {
  const { carId } = useParams();
  // Ovde ćeš kasnije učitati auto po ID-u iz baze
  // Za sada koristimo dummy podatke
  return <DetaljnoAuto carId={carId} />;
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full overflow-hidden bg-gray-500">
        {/* Pozadina */}
        <div className="fixed inset-0 z-0 w-full h-full">
          <Hyperspeed />
        </div>

        {/* Overlay sadržaj */}
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/galerija" element={<CarGallery />} />
              <Route path="/auto/:carId" element={<DetaljnoAutoWrapper />} />
              <Route path="/dodaj-auto" element={<AddCar />} />
              <Route path="/profil" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
