import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import carAPI from "../services/api";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userCars, setUserCars] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [notification, setNotification] = React.useState(null);
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    action: null,
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const showConfirmDialog = (action) => {
    setConfirmDialog({ isOpen: true, action });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, action: null });
  };

  React.useEffect(() => {
    fetchUserCars();
    // eslint-disable-next-line
  }, [user]);

  const fetchUserCars = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const response = await carAPI.getCarsByOwnerWithParams(user._id);
      setUserCars(response.data || []);
    } catch (err) {
      setError(err.message || "Greška pri učitavanju automobila");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCar = (car) => {
    navigate(`/uredi-auto/${car._id}`);
  };

  const handleDeleteCar = async (carId) => {
    showConfirmDialog(async () => {
      try {
        await carAPI.deleteCar(carId);
        setUserCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        showNotification("Automobil je uspešno obrisan!");
      } catch (error) {
        showNotification("Greška pri brisanju automobila", "error");
      }
    });
  };

  const handleAddCar = () => {
    navigate("/dodaj-auto");
  };

  const handleViewCar = (car) => {
    navigate(`/auto/${car._id}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalLikes = userCars.reduce((sum, car) => sum + (car.likes || 0), 0);
  const totalViews = userCars.reduce((sum, car) => sum + (car.views || 0), 0);
  const totalComments = userCars.reduce(
    (sum, car) => sum + (car.comments?.length || 0),
    0
  );

  if (!user) {
    return (
      <div className="w-full py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Niste prijavljeni
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Prijavite se
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Učitavanje profila...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Greška pri učitavanju
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchUserCars}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Član od {user.joinDate ? user.joinDate.slice(0, 4) : "-"}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userCars.length}
                    </div>
                    <div className="text-sm text-gray-600">Automobila</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalLikes}
                    </div>
                    <div className="text-sm text-gray-600">Lajkova</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalComments}
                    </div>
                    <div className="text-sm text-gray-600">Komentara</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalViews}
                    </div>
                    <div className="text-sm text-gray-600">Pregleda</div>
                  </div>
                </div>
              </div>
              {/* Logout dugme */}
              <div className="mt-4 md:mt-0 md:ml-8">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Odjavi se
                </button>
              </div>
            </div>
          </div>

          {/* User's Cars */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Moji Automobili
              </h2>
              <button
                onClick={handleAddCar}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                + Dodaj Auto
              </button>
            </div>

            {userCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCars.map((car) => (
                  <div key={car._id} className="bg-gray-50 rounded-lg p-6">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleViewCar(car)}
                    >
                      <img
                        src={
                          car.mainImage ||
                          car.images?.[0] ||
                          "https://via.placeholder.com/400x300?text=Slika+nije+dostupna"
                        }
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-80 transition-opacity"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {car.brand} {car.model}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
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
                      <p>
                        <span className="font-medium">Boja:</span> {car.color}
                      </p>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-3 pt-3 border-t">
                      <div className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {car.views || 0}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {car.likes || 0}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditCar(car)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
                        Uredi
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                      >
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
                <button
                  onClick={handleAddCar}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Dodaj Auto
                </button>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Podešavanja
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">
                    Email obaveštenja
                  </h3>
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

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={hideConfirmDialog}
        onConfirm={confirmDialog.action}
        title="Brisanje automobila"
        message="Da li ste sigurni da želite da obrišete ovaj automobil? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        cancelText="Otkaži"
        type="danger"
      />
    </>
  );
};

export default Profile;
