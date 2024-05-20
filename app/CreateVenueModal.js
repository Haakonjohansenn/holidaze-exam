"use client";
import { useState } from "react";

const CreateVenueModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState({ url: "", alt: "" }); // Initialize media as an object
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Parse price and maxGuests as numbers
      const parsedPrice = parseFloat(price);
      const parsedMaxGuests = parseInt(maxGuests);
  
      const response = await fetch('https://v2.api.noroff.dev/holidaze/venues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Noroff-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          media: [{ url: media.url, alt: media.alt }],
          price: isNaN(parsedPrice) ? 0 : parsedPrice, // Ensure price is a number, default to 0 if NaN
          maxGuests: isNaN(parsedMaxGuests) ? 0 : parsedMaxGuests, // Ensure maxGuests is a number, default to 0 if NaN
        }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Venue created successfully:', responseData);
        onClose(); // Close the modal
      } else {
        const errorData = await response.json();
        console.error('Venue creation failed:', errorData);
        setErrorMessage(errorData.message || 'Venue creation failed');
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Venue</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              className="w-full p-3 text-sm border rounded-lg h-10"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              className="w-full p-3 text-sm border rounded-lg"
              rows="4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4 flex flex-row md:flex-row gap-4">
            <input
              className="w-full md:w-1/2 p-3 text-sm border rounded-lg h-10"
              type="text"
              placeholder="Media URL"
              value={media.url}
              onChange={(e) => setMedia({ ...media, url: e.target.value })} // Update the url property of media
            />
            <input
              className="w-full md:w-1/2 p-3 text-sm border rounded-lg h-10"
              type="text"
              placeholder="Media Alt"
              value={media.alt}
              onChange={(e) => setMedia({ ...media, alt: e.target.value })} // Update the alt property of media
            />
          </div>
          <div className="mb-4 flex flex-row md:flex-row gap-4">
            <input
              className="w-full md:w-1/2 p-3 text-sm border rounded-lg h-10"
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className="w-full md:w-1/2 p-3 text-sm border rounded-lg h-10"
              type="number"
              placeholder="Max Guests"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div className="flex justify-center p-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 flex justify-center bg-cta-color w-full text-white rounded-lg hover:opacity-70"
            >
              <p className="text-lg font-semibold">Create Venue</p>
            </button>
          </div>
        </form>
        <button
          className="mt-4 text-sm mx-auto flex justify-center text-gray-600 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateVenueModal;

