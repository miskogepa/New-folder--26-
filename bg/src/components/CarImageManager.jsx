import React, { useState } from "react";
import {
  FaTrash,
  FaStar,
  FaStar as FaStarOutline,
  FaPlus,
} from "react-icons/fa";
import { carAPI } from "../services/api";

const CarImageManager = ({ car, onImagesUpdate, isOwner = false }) => {
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [settingMain, setSettingMain] = useState(null);

  const handleDeleteImage = async (index) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu sliku?")) {
      return;
    }

    setDeletingIndex(index);
    try {
      const response = await carAPI.deleteImage(car._id, index);
      onImagesUpdate(response.data);
    } catch (error) {
      console.error("Greška pri brisanju slike:", error);
      alert(error.message || "Greška pri brisanju slike");
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleSetMainImage = async (index) => {
    setSettingMain(index);
    try {
      const response = await carAPI.setMainImage(car._id, index);
      onImagesUpdate({
        images: car.images,
        mainImage: response.data.mainImage,
      });
    } catch (error) {
      console.error("Greška pri postavljanju glavne slike:", error);
      alert(error.message || "Greška pri postavljanju glavne slike");
    } finally {
      setSettingMain(null);
    }
  };

  if (!car.images || car.images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nema slika za ovaj automobil</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Galerija slika {isOwner && "(Vaš automobil)"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {car.images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <img
                src={image}
                alt={`${car.brand} ${car.model} - slika ${index + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Glavna slika indikator */}
              {car.mainImage === image && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FaStar className="text-xs" />
                  Glavna
                </div>
              )}

              {/* Overlay sa akcijama - samo za vlasnika */}
              {isOwner && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Postavi kao glavnu sliku */}
                    {car.mainImage !== image && (
                      <button
                        onClick={() => handleSetMainImage(index)}
                        disabled={settingMain === index}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                        title="Postavi kao glavnu sliku"
                      >
                        {settingMain === index ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaStarOutline className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {/* Obriši sliku */}
                    <button
                      onClick={() => handleDeleteImage(index)}
                      disabled={deletingIndex === index}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                      title="Obriši sliku"
                    >
                      {deletingIndex === index ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FaTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Broj slike */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              {index + 1} / {car.images.length}
            </div>
          </div>
        ))}
      </div>

      {/* Informacije za vlasnika */}
      {isOwner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            Upravljanje slikama
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Hover preko slike da vidite opcije</li>
            <li>• Kliknite na zvezdicu da postavite glavnu sliku</li>
            <li>• Kliknite na kantu da obrišete sliku</li>
            <li>• Glavna slika se prikazuje kao prva u galeriji</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CarImageManager;
