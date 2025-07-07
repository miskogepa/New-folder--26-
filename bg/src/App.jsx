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
import EditCar from "./components/EditCar";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import Hyperspeed from "./Hyperspeed";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Wrapper komponenta za DetaljnoAuto da može da pristupi URL parametrima
const DetaljnoAutoWrapper = () => {
  const { carId } = useParams();
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dodaj-auto"
                element={
                  <ProtectedRoute>
                    <AddCar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/uredi-auto/:id"
                element={
                  <ProtectedRoute>
                    <EditCar />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
