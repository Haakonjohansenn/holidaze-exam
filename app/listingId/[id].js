// pages/listing/[id].js

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchListingById } from '../../lib/api';

const ListingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await fetchListingById(id);
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error.message || 'Failed to fetch listing');
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div>
      <h2>{listing.name}</h2>
      <p>{listing.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default ListingPage;
