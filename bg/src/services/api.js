const API_BASE_URL = "http://localhost:5000/api";

// Helper funkcija za API pozive
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API greška");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Helper funkcija za upload fajlova
const uploadCall = async (endpoint, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData, // Ne dodaj Content-Type header za FormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload greška");
    }

    return data;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};

// Car API funkcije
export const carAPI = {
  // GET - Svi automobili
  getAllCars: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/cars${queryString ? `?${queryString}` : ""}`;
    return apiCall(endpoint);
  },

  // GET - Automobil po ID-u
  getCarById: async (id) => {
    return apiCall(`/cars/${id}`);
  },

  // POST - Novi automobil
  createCar: async (carData) => {
    return apiCall("/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  },

  // PUT - Ažuriranje automobila
  updateCar: async (id, carData) => {
    return apiCall(`/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  },

  // DELETE - Brisanje automobila
  deleteCar: async (id) => {
    return apiCall(`/cars/${id}`, {
      method: "DELETE",
    });
  },

  // POST - Lajkovanje automobila
  likeCar: async (id) => {
    return apiCall(`/cars/${id}/like`, {
      method: "POST",
    });
  },

  // POST - Uklanjanje lajka
  unlikeCar: async (id) => {
    return apiCall(`/cars/${id}/unlike`, {
      method: "POST",
    });
  },

  // GET - Pretraga po marki
  searchByBrand: async (brand) => {
    return apiCall(`/cars/search/brand/${brand}`);
  },

  // GET - Automobili po vlasniku
  getCarsByOwner: async (owner) => {
    return apiCall(`/cars/owner/${owner}`);
  },
};

// Upload API funkcije
export const uploadAPI = {
  // Upload jedne slike
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return uploadCall("/upload/single", formData);
  },

  // Upload više slika
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    return uploadCall("/upload/multiple", formData);
  },

  // Brisanje slike
  deleteImage: async (publicId) => {
    return apiCall(`/upload/${publicId}`, {
      method: "DELETE",
    });
  },
};

// Helper funkcije za error handling
export const handleAPIError = (error) => {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.message || "Došlo je do greške",
  };
};

// Loading state helper
export const createLoadingState = () => ({
  loading: false,
  error: null,
  data: null,
});

export default carAPI;
