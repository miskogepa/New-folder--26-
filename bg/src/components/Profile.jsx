import React from "react";
import { cars } from "../data/data.js";

const Profile = () => {
  // Demo korisnik - kasnije će se učitati iz baze
  const currentUser = {
    name: "Milan Minjović",
    email: "milan@example.com",
    joinDate: "2024",
    cars: cars.filter((car) => car.owner === "Milan Minjović"),
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {currentUser.name}
              </h1>
              <p className="text-gray-600 mb-2">{currentUser.email}</p>
              <p className="text-sm text-gray-500">
                Član od {currentUser.joinDate}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentUser.cars.length}
                  </div>
                  <div className="text-sm text-gray-600">Automobila</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-sm text-gray-600">Lajkova</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Komentara</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Cars */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Moji Automobili
          </h2>

          {currentUser.cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUser.cars.map((car) => (
                <div key={car.id} className="bg-gray-50 rounded-lg p-6">
                  <img
                    src={car.image}
                    alt={car.model}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {car.model}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Marka:</span> {car.brand}
                    </p>
                    <p>
                      <span className="font-medium">Godina:</span> {car.year}
                    </p>
                    <p>
                      <span className="font-medium">Gorivo:</span> {car.fuel}
                    </p>
                    <p>
                      <span className="font-medium">Kilometraža:</span>{" "}
                      {car.mileage}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Uredi
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nemate automobila
              </h3>
              <p className="text-gray-600 mb-4">
                Dodajte svoj prvi automobil da počnete da delite sa drugim
                članovima kluba.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                Dodaj Auto
              </button>
            </div>
          )}
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Podešavanja</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Email obaveštenja</h3>
                <p className="text-sm text-gray-600">
                  Primaj obaveštenja o novim komentarima
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                Uključi
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  Privatnost profila
                </h3>
                <p className="text-sm text-gray-600">
                  Učini svoj profil javnim
                </p>
              </div>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors">
                Isključi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
