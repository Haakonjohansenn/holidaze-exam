"use client";
import { useState, useEffect } from "react";
import { fetchVenues } from "../../lib/api";
import Link from "next/link";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null); // State for error handling
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const venuesPerPage = 100; // Number of venues per page

  // Optional state to hold pagination meta information
  const [paginationMeta, setPaginationMeta] = useState(null);

  useEffect(() => {
    const getVenues = async () => {
      try {
        const data = await fetchVenues(currentPage, venuesPerPage);
        setVenues(data.data); // Update venues state with fetched data
        setPaginationMeta(data.meta); // Update pagination meta
      } catch (error) {
        console.error(error);
        setError(error.message); // Set error message in state
      }
    };

    getVenues();
  }, [currentPage]); // Re-fetch on page change

  // Filter listings based on the search term
  const filteredVenues = venues?.filter((venue) => (
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Pagination buttons (optional - implement logic for handling clicks)
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paginationMeta && !paginationMeta.isLastPage) {
      setCurrentPage(currentPage + 1);
    }
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <div>
        <h1>Venues</h1>
        {/* Search input field */}
        <input
          type="text"
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
        />
        <div className="flex flex-wrap gap-6 p-4 justify-center">
          {filteredVenues.map((venue) => (
            <Link key={venue.id} href={`/listingid/${venue.id}`}>
              <div
                key={venue.id}
                className="venue-card flex flex-col flex-auto shadow bg-white cursor-pointer max-w-96 min-w-96 hover:shadow-md"
              >
                {venue.media.length > 0 && (
                  <img
                    src={venue.media[0].url}
                    alt={venue.media[0].alt}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="flex flex-col p-4">
                  <h2>{venue.name}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination (optional) */}
        {paginationMeta && (
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {paginationMeta.pageCount}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
              disabled={!paginationMeta || paginationMeta.isLastPage}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;