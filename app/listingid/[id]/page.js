"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchVenueById, fetchVenueBookings, createBooking } from "@/lib/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const VenuePage = () => {
  const params = useParams();
  const { id } = params;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleConfirmBooking = async () => {
    try {
      // Check if a date is selected
      if (!selectedDate) {
        throw new Error("Please select a date");
      }
  
      // Send request to create booking
      const bookingData = {
        dateFrom: selectedDate.toISOString(), // Convert date to string format
        dateTo: selectedDate.toISOString(),
        guests: 1, // Assuming 1 guest for now
        venueId: id, // Use the venue ID for booking
      };
  
      const response = await createBooking(bookingData);
  
      if (response.ok) {
        console.log("Booking confirmed successfully:", response.data);
        // Handle success - maybe show a success message to the user
      } else {
        throw new Error(response.error || "Failed to confirm booking. Please try again later.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error.message);
      setError(error.message || "An unexpected error occurred. Please try again later.");
    }
  };
  

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div>Error: {error}</div>
      ) : venue ? (
        <>
          {venue.media.length > 0 && (
            <img
              src={venue.media[0].url}
              alt={venue.media[0].alt}
              className="w-full h-40 object-cover"
            />
          )}
          <h2>{venue.name}</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={({ date }) => bookedDates.some(d => d.getTime() === date.getTime())} // Disable booked dates
            // Add any additional props you want for the calendar
          />
          <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </>
      ) : (
        <p>Venue not found...</p>
      )}
    </div>
  );
};

export default VenuePage;
