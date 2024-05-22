"use client"
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
  };

  const handleCheckOutDateChange = (date) => {
    setSelectedCheckOutDate(date);
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
        console.log("Booking confirmed successfully:", response.data);
        // Handle success - maybe show a success message to the user
      } else {
        throw new Error("Failed to confirm booking. Please try again later.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
      setError("Failed to confirm booking. Please try again later.");
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
        <div>Error: {error}</div>
      ) : venue ? (
        <div className="max-w-lg mx-auto">
          {venue.media.length > 0 && (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt}
              className="w-full h-40 object-cover mb-4"
            />
          )}
          <h2 className="text-xl font-semibold mb-4">{venue.name}</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-32">Check-in Date:</label>
              <input
                type="text"
                value={
                  selectedCheckInDate
                    ? selectedCheckInDate.toLocaleDateString()
                    : ""
                }
                onFocus={handleCheckInFocus}
                readOnly
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
              />
              {showCheckInCalendar && (
                <Calendar
                  onChange={handleCheckInDateChange}
                  value={selectedCheckInDate}
                  tileDisabled={tileDisabled}
                />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-32">Check-out Date:</label>
              <input
                type="text"
                value={
                  selectedCheckOutDate
                    ? selectedCheckOutDate.toLocaleDateString()
                    : ""
                }
                onFocus={handleCheckOutFocus}
                readOnly
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
              />
              {showCheckOutCalendar && (
                <Calendar
                  onChange={handleCheckOutDateChange}
                  value={selectedCheckOutDate}
                  tileDisabled={tileDisabled}
                />
              )}
            </div>
            <div className="flex items-center space-x-4">
              <label className="w-32">Number of Guests:</label>
              <input
                type="number"
                value={numGuests}
                onChange={handleNumGuestsChange}
                className="border border-gray-300 px-2 py-1 rounded focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      ) : (
        <p>Venue not found...</p>
      )}
    </div>
  );
};

export default VenuePage;