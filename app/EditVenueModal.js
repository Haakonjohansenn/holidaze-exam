"use client";
import { useState } from "react";
import { updateVenue } from "@/lib/api";

const EditVenueModal = ({ onClose, venue }) => {
  const { id } = venue || {};
  
  const [name, setName] = useState(venue ? venue.name : "");
  const [description, setDescription] = useState(venue ? venue.description : "");
  const [media, setMedia] = useState({ url: venue ? venue.media[0].url : "", alt: venue ? venue.media[0].alt : "" });
  const [price, setPrice] = useState(venue ? String(venue.price) : "");
  const [maxGuests, setMaxGuests] = useState(venue ? String(venue.maxGuests) : "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Prepare the updated venue data
      const updatedVenue = {
        id,
        name,
        description,
        media: [{ url: media.url, alt: media.alt }],
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests),
      };
      // Call the updateVenue function to update the venue
      await updateVenue(updatedVenue); // Assuming you have an updateVenue function in your API
  
      // Close the modal after successful update
      onClose();
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Venue</h2>
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
              <p className="text-lg font-semibold">Update Venue</p>
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

export default EditVenueModal;
