"use client";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import VenueCard from "../VenueCard";
import EditVenueModal from "../EditVenueModal";
import {
  fetchLoggedInProfile,
  fetchLoggedInProfileVenues,
  deleteVenue,
  fetchBookingsForVenue,
  fetchBookingsByProfile,
} from "../../lib/api";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [currentVenueIndex, setCurrentVenueIndex] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchProfileAndData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const apiKey = localStorage.getItem("apiKey");
      const userName = localStorage.getItem("name");

      if (!accessToken || !apiKey) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await fetchLoggedInProfile(
          accessToken,
          apiKey,
          userName
        );
        setProfile(profileData);

        const venueData = await fetchLoggedInProfileVenues(
          accessToken,
          apiKey,
          userName
        );
        setVenues(venueData);

        const userBookingsData = await fetchBookingsByProfile(
          userName,
          accessToken,
          apiKey
        );
        setUserBookings(userBookingsData.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndData();
  }, []);

  const handleDeleteVenue = async (venueId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?"
    );
    if (confirmDelete) {
      try {
        await deleteVenue(venueId);

        setVenues((prevVenues) =>
          prevVenues.filter((venue) => venue.id !== venueId)
        );

        setCurrentVenueIndex((prevIndex) =>
          prevIndex === venues.length - 1
            ? Math.max(0, prevIndex - 1)
            : prevIndex
        );
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleViewBookings = async (venueId) => {
    // Logic to fetch bookings for the selected venue and set them
    // You need to implement this according to your API or data source
    try {
      const venueBookings = await fetchBookingsForVenue(venueId);
      setBookings(venueBookings);
      setShowBookingModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNextVenue = () => {
    setCurrentVenueIndex((prevIndex) => (prevIndex + 1) % venues.length);
  };

  const handlePrevVenue = () => {
    setCurrentVenueIndex((prevIndex) =>
      prevIndex === 0 ? venues.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="profile-page flex flex-col lg:flex-row p-8 gap-8">
      <div className="left-section flex flex-col gap-8">
        <div className="profile-card w-full max-h-72 max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-center p-5">
            <img
              src={profile.avatar.url || profile.avatar.file}
              className="avatar rounded-full w-2/4 h-2/4"
              alt="Profile Avatar"
            />
          </div>
          <div className="profile-details flex flex-row gap-2 justify-center p-3">
            <p className="flex justify-center text-xl font-semibold">
              {profile.name}
            </p>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#D8315B"
              viewBox="0 0 20 20"
            >
              <path
                fill="#D8315B"
                d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"
              />
              <path
                fill="#fff"
                d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"
              />
            </svg>
          </div>
        </div>

        {venues.length > 0 && (
          <div className="flex flex-col max-w-sm">
            <h2 className="text-center py-4">Your venues:</h2>
            <div className="venue-carousel flex items-center justify-between">
              <button className="mr-4" onClick={handlePrevVenue}>
                <FaChevronLeft className="carousel-icon" />
              </button>
              <div className="flex-grow">
                <VenueCard
                  venue={venues[currentVenueIndex]}
                  onDelete={handleDeleteVenue}
                  onEdit={handleOpenEditModal}
                  onViewBookings={() =>
                    handleViewBookings(venues[currentVenueIndex].id)
                  }
                />
              </div>
              <button className="ml-4" onClick={handleNextVenue}>
                <FaChevronRight className="carousel-icon" />
              </button>
            </div>
          </div>
        )}

        {showEditModal && (
          <EditVenueModal
            venue={venues[currentVenueIndex]}
            onClose={handleCloseEditModal}
          />
        )}

        {showBookingModal && (
          <div className="booking-modal">
            <h2>Bookings for {venues[currentVenueIndex].name}</h2>
            <ul>
              {Array.isArray(bookings) &&
                bookings.map((booking) => (
                  <li key={booking.id}>
                    <div>
                      <p>Date From: {booking.dateFrom}</p>
                      <p>Date To: {booking.dateTo}</p>
                      <p>Guests: {booking.guests}</p>
                      <p>Created: {booking.created}</p>
                      <p>Updated: {booking.updated}</p>
                    </div>
                  </li>
                ))}
            </ul>
            <button onClick={() => setShowBookingModal(false)}>Close</button>
          </div>
        )}
      </div>

      <div className="user-bookings flex flex-col max-w-sm lg:max-w-md lg:ml-8">
        <h2 className="text-center py-4">Your upcoming bookings:</h2>
        <ul className="booking-list">
          {Array.isArray(userBookings) && userBookings.length > 0 ? (
            userBookings.map((booking) => (
              <li
                key={booking.id}
                className="booking-item bg-white border border-gray-200 rounded-lg shadow-xl p-4 mb-4"
              >
                <div>
                  <p><strong>Date From:</strong> {booking.dateFrom}</p>
                  <p><strong>Date To:</strong> {booking.dateTo}</p>
                  <p><strong>Guests:</strong> {booking.guests}</p>
                  <p><strong>Created:</strong> {booking.created}</p>
                  <p><strong>Updated:</strong> {booking.updated}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No upcoming bookings found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
