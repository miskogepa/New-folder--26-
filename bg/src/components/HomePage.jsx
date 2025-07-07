import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCar,
  FaUsers,
  FaTags,
  FaEye,
  FaHeart,
  FaCalendarAlt,
} from "react-icons/fa";

const HomePage = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBrands: 0,
    totalViews: 0,
    totalLikes: 0,
    recentCars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch statistics from the new stats endpoint
      const statsResponse = await fetch("http://localhost:5000/api/auth/stats");
      console.log("Stats API Response status:", statsResponse.status);

      if (!statsResponse.ok) {
        throw new Error(`HTTP error! status: ${statsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      console.log("Stats API Response data:", statsData);

      if (statsData.success) {
        const newStats = statsData.data;
        console.log("Received stats:", newStats);
        setStats(newStats);
      } else {
        console.error("Stats API returned success: false", statsData);
        throw new Error("Stats API returned success: false");
      }
    } catch (error) {
      console.error("Greška pri učitavanju statistika:", error);

      // Ako je backend nedostupan, prikaži poruku
      if (error.message.includes("fetch")) {
        console.log(
          "Backend server nije dostupan. Prikazujem demo statistike."
        );
        // Demo statistike za testiranje
        setStats({
          totalCars: 1,
          totalUsers: 2,
          totalBrands: 1,
          totalViews: 5,
          totalLikes: 3,
          recentCars: 1,
        });
      } else {
        // Fallback to default stats
        setStats({
          totalCars: 0,
          totalUsers: 0,
          totalBrands: 0,
          totalViews: 0,
          totalLikes: 0,
          recentCars: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, value, label, color, delay = 0 }) => (
    <div
      className={`text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${color}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`text-4xl mb-4 ${color.replace("border-", "text-")}`}>
        <Icon />
      </div>
      <div
        className={`text-3xl font-bold ${color.replace(
          "border-",
          "text-"
        )} mb-2`}
      >
        {loading ? (
          <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );

  return (
    <div className="w-full py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏎️</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dobrodošli u Auto Klub!
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Podelite svoje automobile sa drugim entuzijastima. Pregledajte
            galeriju, dodajte svoje vozilo i upoznajte druge članove kluba.
            Pridružite se našoj zajednici auto ljubitelja!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/galerija"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🚗 Pregledaj Galeriju
            </Link>
            <Link
              to="/dodaj-auto"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ➕ Dodaj Svoj Auto
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="text-5xl mb-6">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Galerija Automobila
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Pregledajte automobile drugih članova kluba sa detaljnim
              informacijama i visokokvalitetnim slikama.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="text-5xl mb-6">➕</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Dodajte Svoj Auto
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Podelite slike i informacije o svom automobilu sa ostalim
              članovima. Lako i brzo dodavanje vozila.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="text-5xl mb-6">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Upoznajte Članove
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Povežite se sa drugim auto entuzijastima i podelite iskustva.
              Gradite prijateljstva kroz ljubav prema automobilima.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            📊 Statistike Kluba
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center p-6">
                  <div className="animate-pulse bg-gray-300 h-12 w-12 mx-auto rounded-full mb-4"></div>
                  <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded mb-2"></div>
                  <div className="animate-pulse bg-gray-300 h-4 w-20 mx-auto rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <StatCard
                icon={FaCar}
                value={stats.totalCars}
                label="Automobila"
                color="border-blue-500"
                delay={0}
              />
              <StatCard
                icon={FaUsers}
                value={stats.totalUsers}
                label="Članova"
                color="border-green-500"
                delay={100}
              />
              <StatCard
                icon={FaTags}
                value={stats.totalBrands}
                label="Marki"
                color="border-purple-500"
                delay={200}
              />
              <StatCard
                icon={FaEye}
                value={stats.totalViews}
                label="Pregleda"
                color="border-orange-500"
                delay={300}
              />
              <StatCard
                icon={FaHeart}
                value={stats.totalLikes}
                label="Lajkova"
                color="border-red-500"
                delay={400}
              />
              <StatCard
                icon={FaCalendarAlt}
                value={stats.recentCars}
                label="Nedavno"
                color="border-indigo-500"
                delay={500}
              />
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Statistike se ažuriraju u realnom vremenu
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pridružite se našoj zajednici! 🚀
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Registrujte se i počnite da delite svoje automobile sa drugim
              entuzijastima
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors inline-block"
            >
              Registruj se Sada
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
