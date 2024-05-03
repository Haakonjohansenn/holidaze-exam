"use client";
import { useState, useEffect } from "react";
import { fetchListings } from "../lib/api"; // Assuming api.js is in the same directory
import Link from "next/link";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const getListings = async () => {
      try {
        const data = await fetchListings();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getListings();
  }, []);

  // Filter listings based on the search term
  const filteredListings = listings.filter((listing) => {
    return listing.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div>
        <h1>Listings</h1>
        {/* Search input field */}
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <div className="flex flex-wrap gap-8 p-4">
          {filteredListings.map((listing) => (
            <Link key={listing.id} href="/listingId/[id]" as={`/listingId/${listing.id}`}>
              <div
                key={listing.id}
                className="venue-card flex flex-col flex-auto shadow bg-white cursor-pointer w-80"
              >
                {listing.media.length > 0 && (
                  <img
                    src={listing.media[0].url}
                    alt={listing.media[0].alt}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="flex flex-col p-4">
                  <h2>{listing.name}</h2>
                  <p>{listing.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
