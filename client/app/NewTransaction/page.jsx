"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import the useRouter hook

const page = () => {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    type: "income",
    category: "",
    subCategory: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(
      "https://exptrack-2ja3yr760-adriendjiongos-projects.vercel.app/Categories"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  console.log(new Date().toLocaleString("fr-FR").substring(0, 10) + "yo");

  console.log("formData", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // envoyer à la bd

    formData.id = Math.random();
    formData.date = new Date().toLocaleDateString("fr-FR").substring(0, 10);
    fetch(
      "https://exptrack-2ja3yr760-adriendjiongos-projects.vercel.app/Transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // No need to stringify for FormData
      }
    )
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .then(() => (window.location.href = "/Transactions"))
      .catch((error) => {
        console.error("Error:", error);
        return 0;
      });

    console.log("Transaction ajoutée :", JSON.stringify(formData));

    // Reset the form
    setFormData({
      id: 0,
      description: "",
      price: "",
      type: "income",
      category: "",
      subCategory: "",
      date: "",
    });

    // Redirect to the home page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Ajouter une Transaction
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Achat de shawarma"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Prix */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="price"
            >
              Prix
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ex: 5000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="type"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="income">Income</option>
              <option value="outcome">Outcome</option>
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="category"
            >
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">-- Sélectionnez une catégorie --</option>
              {categories
                .filter((cat) => cat.type === formData.type)
                .map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Bouton Ajouter */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter la Transaction
          </button>
        </form>
      </div>
    </div>
  );
};
export default page;
