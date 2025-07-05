import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Dobrodošli u Auto Klub! 🏎️
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Podelite svoje automobile sa drugim entuzijastima. Pregledajte
            galeriju, dodajte svoje vozilo i upoznajte druge članove kluba.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/galerija"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Pregledaj Galeriju
            </Link>
            <Link
              to="/dodaj-auto"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Dodaj Svoj Auto
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Galerija Automobila
            </h3>
            <p className="text-gray-600">
              Pregledajte automobile drugih članova kluba sa detaljnim
              informacijama.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Dodajte Svoj Auto
            </h3>
            <p className="text-gray-600">
              Podelite slike i informacije o svom automobilu sa ostalim
              članovima.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Upoznajte Članove
            </h3>
            <p className="text-gray-600">
              Povežite se sa drugim auto entuzijastima i podelite iskustva.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Statistike Kluba
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
              <div className="text-gray-600">Automobila</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-gray-600">Članova</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Marki</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
