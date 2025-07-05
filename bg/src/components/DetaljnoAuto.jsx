import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import carAPI, { uploadAPI } from "../services/api";

const DetaljnoAuto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [commentForm, setCommentForm] = useState({
    author: "",
    text: "",
    images: [],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingImages, setSubmittingImages] = useState(false);
  const navigate = useNavigate();
  const { carId } = useParams();

  // Učitaj auto po ID-u iz API-ja
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await carAPI.getCarById(carId);
        console.log("Detalji automobila:", response);
        setCar(response.data);
      } catch (err) {
        console.error("Greška pri učitavanju automobila:", err);
        setError(err.message || "Automobil nije pronađen");
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleBack = () => {
    navigate("/galerija");
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await carAPI.unlikeCar(carId);
        setCar((prev) => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        await carAPI.likeCar(carId);
        setCar((prev) => ({ ...prev, likes: prev.likes + 1 }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Greška pri lajkovanju:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmittingComment(true);

      // Upload slika ako postoje
      let uploadedImageUrls = [];
      if (commentForm.images.length > 0) {
        setUploadingImages(true);
        const uploadResponse = await uploadAPI.uploadMultiple(
          commentForm.images
        );
        uploadedImageUrls = uploadResponse.data.map((img) => img.url);
        setUploadingImages(false);
      }

      // Dodaj komentar
      const response = await carAPI.addComment(carId, {
        author: commentForm.author,
        text: commentForm.text,
        images: uploadedImageUrls,
      });

      // Ažuriraj stanje
      setCar(response.data);
      setCommentForm({ author: "", text: "", images: [] });
      setShowCommentForm(false);
    } catch (error) {
      console.error("Greška pri dodavanju komentara:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmittingImages(true);

      // Upload slika
      const uploadResponse = await uploadAPI.uploadMultiple(commentForm.images);
      const uploadedImageUrls = uploadResponse.data.map((img) => img.url);

      // Dodaj slike u glavnu galeriju
      const response = await carAPI.addImages(carId, uploadedImageUrls);

      // Ažuriraj stanje
      setCar(response.data);
      setCommentForm({ author: "", text: "", images: [] });
      setShowImageForm(false);
    } catch (error) {
      console.error("Greška pri dodavanju slika:", error);
    } finally {
      setSubmittingImages(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    // Validacija veličine fajlova
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert(
        `Slike ${oversizedFiles
          .map((f) => f.name)
          .join(", ")} su prevelike. Maksimalna veličina je 10MB.`
      );
      return;
    }

    if (files.length > 5) {
      alert("Možete izabrati maksimalno 5 slika.");
      return;
    }

    setCommentForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const removeImage = (index) => {
    setCommentForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteComment = async (commentId) => {
    if (
      window.confirm("Da li ste sigurni da želite da obrišete ovaj komentar?")
    ) {
      try {
        await carAPI.deleteComment(carId, commentId);
        // Ažuriraj stanje - ukloni komentar iz liste
        setCar((prev) => ({
          ...prev,
          comments: prev.comments.filter(
            (comment) => comment._id !== commentId
          ),
        }));
      } catch (error) {
        console.error("Greška pri brisanju komentara:", error);
      }
    }
  };

  const handleDeleteCar = async () => {
    if (
      window.confirm(
        "Da li ste sigurni da želite da obrišete ovaj automobil? Ova akcija se ne može poništiti."
      )
    ) {
      try {
        await carAPI.deleteCar(carId);
        alert("Automobil je uspešno obrisan!");
        navigate("/galerija");
      } catch (error) {
        console.error("Greška pri brisanju automobila:", error);
        alert("Greška pri brisanju automobila. Pokušajte ponovo.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Učitavanje automobila...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="w-full py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Automobil nije pronađen"}
          </h1>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Nazad na galeriju
          </button>
        </div>
      </div>
    );
  }

  // Koristi prave slike iz baze
  const carImages =
    car.images && car.images.length > 0 ? car.images : [car.mainImage];

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Nazad na galeriju
        </button>

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Main image */}
          <div className="relative h-96">
            <img
              src={car.mainImage || car.images?.[0]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            {/* Like button overlay */}
            <button
              onClick={handleLike}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg
                className={`w-6 h-6 ${
                  liked ? "text-red-500 fill-current" : "text-gray-600"
                }`}
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
            </button>
          </div>

          {/* Car info and description */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-600">Vlasnik: {car.owner}</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  {car.views || 0} pregleda
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  {car.likes || 0} lajkova
                </div>
              </div>
            </div>

            {/* Specifications grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Specifikacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marka:</span>
                    <span className="font-medium">{car.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{car.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Godina:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gorivo:</span>
                    <span className="font-medium">{car.fuel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dodatne informacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kilometraža:</span>
                    <span className="font-medium">{car.mileage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Boja:</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stanje:</span>
                    <span className="font-medium">{car.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dodato:</span>
                    <span className="font-medium">
                      {new Date(car.createdAt).toLocaleDateString("sr-RS")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Opis</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {car.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Dodaj komentar
              </button>
              <button
                onClick={() => setShowImageForm(!showImageForm)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Dodaj slike
              </button>
              <button
                onClick={handleDeleteCar}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Obriši auto
              </button>
            </div>

            {/* Comment form */}
            {showCommentForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Dodaj komentar
                </h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ime *
                    </label>
                    <input
                      type="text"
                      value={commentForm.author}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Vaše ime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komentar *
                    </label>
                    <textarea
                      value={commentForm.text}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Napišite komentar (npr. servis, modifikacije, itd.)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slike (opciono)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maksimalno 5 slika, 10MB po slici
                    </p>
                  </div>

                  {/* Image preview */}
                  {commentForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {commentForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submittingComment || uploadingImages}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {submittingComment ? "Dodavanje..." : "Dodaj komentar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Otkaži
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Image form */}
            {showImageForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Dodaj slike u galeriju
                </h3>
                <form onSubmit={handleImageSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slike *
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maksimalno 5 slika, 10MB po slici
                    </p>
                  </div>

                  {/* Image preview */}
                  {commentForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {commentForm.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submittingImages}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {submittingImages ? "Dodavanje..." : "Dodaj slike"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Otkaži
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Comments section */}
            {car.comments && car.comments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Komentari ({car.comments.length})
                </h3>
                <div className="space-y-4">
                  {car.comments.map((comment, index) => (
                    <div
                      key={comment._id || index}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {comment.author}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "sr-RS"
                            )}{" "}
                            {new Date(comment.createdAt).toLocaleTimeString(
                              "sr-RS"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Obriši
                        </button>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.text}</p>

                      {/* Comment images */}
                      {comment.images && comment.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {comment.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Komentar slika ${imgIndex + 1}`}
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                              onClick={() => openModal(image)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image gallery */}
            {carImages && carImages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Galerija slika ({carImages.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {carImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-xl cursor-pointer"
                      onClick={() => openModal(image)}
                    >
                      <img
                        src={image}
                        alt={`${car.brand} ${car.model} - slika ${index + 1}`}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Slika+nije+dostupna";
                        }}
                      />
                      <div className="py-3 text-center">
                        <span className="block text-gray-500 text-sm">
                          Slika {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for full size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Velika slika"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetaljnoAuto;
