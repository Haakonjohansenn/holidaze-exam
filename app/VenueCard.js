import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const VenueCard = ({ venue, onDelete, onEdit }) => {

  const handleDelete = () => {
    if (onDelete) {
      onDelete(venue.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(venue);
    }
  };

  return (
    <div
      key={venue.id}
      className="venue-card flex flex-col flex-auto shadow bg-white hover:shadow-md cursor-pointer"
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
      <div className="flex justify-between mt-4">
        <button onClick={handleEdit}>
          <FaEdit className="mr-2" />
          Edit
        </button>
        <button onClick={handleDelete}>
          <FaTrash className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default VenueCard;