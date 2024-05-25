"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchVenueById, createBooking, fetchBookingsForVenue } from "@/lib/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const VenuePage = () => {
  const params = useParams();
  const { id } = params;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(null);
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(null);
  const [numGuests, setNumGuests] = useState(1);
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false);
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        const venueData = await fetchVenueById(id);
        setVenue(venueData);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError("Failed to fetch venue. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenueData();
    }
  }, [id]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (venue) {
        try {
          const bookings = await fetchBookingsForVenue(id);
          setExistingBookings(bookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setError("Failed to fetch bookings. Please try again later.");
        }
      }
    };

    fetchBookings();
  }, [id, venue]);

  // Function to check if a date is available for booking
  const isDateAvailable = (date) => {
    // Convert date to ISO string without time
    const dateString = date.toISOString().split("T")[0];
    // Check if the date is already booked
    return !existingBookings.some((booking) => {
      const bookingDate = new Date(booking.dateFrom);
      const bookingDateString = bookingDate.toISOString().split("T")[0];
      return bookingDateString === dateString;
    });
  };

  // Function to disable unavailable dates in the calendar
  const tileDisabled = ({ date }) => !isDateAvailable(date);

  const handleCheckInDateChange = (date) => {
    setSelectedCheckInDate(date);
    setShowCheckInCalendar(false);
  };

  const handleCheckOutDateChange = (date) => {
    setSelectedCheckOutDate(date);
    setShowCheckOutCalendar(false);
  };

  const handleNumGuestsChange = (event) => {
    setNumGuests(event.target.value);
  };

  const handleConfirmBooking = async () => {
    try {
      // Check if check-in and check-out dates are selected
      if (!selectedCheckInDate || !selectedCheckOutDate) {
        throw new Error("Please select check-in and check-out dates");
      }

      // Send request to create booking
      const bookingData = {
        dateFrom: selectedCheckInDate.toISOString(),
        dateTo: selectedCheckOutDate.toISOString(),
        guests: numGuests,
        venueId: venue.id,
      };

      const response = await createBooking(bookingData);

      if (response && response.data) {
        setSuccessMessage("Booking confirmed successfully.");
        setErrorMessage(null);
      } else {
        throw new Error("Failed to confirm booking. Please try again later.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
      setErrorMessage("Failed to confirm booking. Please try again later.");
      setSuccessMessage(null);
    }
  };

  const handleCheckInFocus = () => {
    setShowCheckInCalendar(true);
    setShowCheckOutCalendar(false);
  };

  const handleCheckOutFocus = () => {
    setShowCheckOutCalendar(true);
    setShowCheckInCalendar(false);
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : venue ? (
        <div className="max-w-lg mx-auto">
          {venue.media.length > 0 && (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt}
              className="w-full h-40 object-cover mb-4 rounded-md"
            />
          )}
          <h2 className="text-2xl font-bold mb-4">{venue.name}</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label className="w-full sm:w-32 font-semibold">Check-in Date:</label>
              <input
                type="text"
                value={
                  selectedCheckInDate
                    ? selectedCheckInDate.toLocaleDateString()
                    : ""
                }
                onFocus={handleCheckInFocus}
                readOnly
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none w-full sm:w-auto"
              />
              {showCheckInCalendar && (
                <Calendar
                  onChange={handleCheckInDateChange}
                  value={selectedCheckInDate}
                  tileDisabled={tileDisabled}
                  className="calendar mt-2 w-full sm:w-auto shadow-lg rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label className="w-full sm:w-32 font-semibold">Check-out Date:</label>
              <input
                type="text"
                value={
                  selectedCheckOutDate
                    ? selectedCheckOutDate.toLocaleDateString()
                    : ""
                }
                onFocus={handleCheckOutFocus}
                readOnly
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none w-full sm:w-auto"
              />
              {showCheckOutCalendar && (
                <Calendar
                  onChange={handleCheckOutDateChange}
                  value={selectedCheckOutDate}
                  tileDisabled={tileDisabled}
                  className="calendar mt-2 w-full sm:w-auto shadow-lg rounded-md"
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label className="w-full sm:w-32 font-semibold">Number of Guests:</label>
              <input
                type="number"
                value={numGuests}
                onChange={handleNumGuestsChange}
                className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none w-full sm:w-auto"
                min="1"
              />
            </div>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="bg-cta-color text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
            >
              Confirm Booking
            </button>
            {successMessage && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Venue not found...</p>
      )}
    </div>
  );
};

export default VenuePage;
