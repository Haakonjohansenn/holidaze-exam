"use client"
export const loginUser = async (email, password) => {
  const payload = { email, password };
  try {
    const loginResponse = await fetch(`https://v2.api.noroff.dev/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok || loginData.data.accessToken) {

      const createApiKeyResponse = await fetch(`https://v2.api.noroff.dev/auth/create-api-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.data.accessToken}`,
        },
        body: JSON.stringify({ name: "apiKey" }),
      });

      if (createApiKeyResponse.ok) {
        const apiKeyData = await createApiKeyResponse.json();
        console.log("API Key created:", apiKeyData.data);
      
        // Log the API key before storing it in local storage
        console.log("Received API Key:", apiKeyData.data.key);
      
        // Store the API key in local storage
        localStorage.setItem("apiKey", apiKeyData.data.key);
      
        // Verify that the API key is stored correctly
        console.log("API Key stored in local storage:", localStorage.getItem("apiKey"));
      }      

      localStorage.setItem("accessToken", loginData.data.accessToken);
      localStorage.setItem("name", loginData.data.name)
      console.log("name recieved", localStorage.getItem("name"))
      
      return { success: true, data: loginData };
    } else {
      return { success: false, error: loginData.message };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "An unexpected error occurred during login. Please try again." };
  }
};



export const registerUser = async (name, email, password, avatarURL, avatarFile, venueManager) => {
  const payload = {
    name,
    email,
    password,
    avatarURL,
    avatarFile,
    venueManager
  };

  try {
    console.log(venueManager)
    const response = await fetch(`https://v2.api.noroff.dev/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData.data)
      console.log(responseData)
      const newAccessToken = responseData.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return { success: true, data: responseData };
    } else {
      let errorMessages = ["An unexpected error occurred during registration. Please try again."];

      try {
        const errorData = await response.json();
        console.log("Error data:", errorData); // Log the error data
        if (errorData.errors) {
          // If the 'errors' property is present, extract error messages
          const errors = errorData.errors;
          errorMessages = errors.map((err) => err.message);
        }
      } catch (error) {
        console.error("Error parsing error response:", error);
      }

      console.log("Error messages:", errorMessages); // Log the error messages
      return { success: false, error: errorMessages };
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return { success: false, error: ["An unexpected error occurred during registration. Please try again."] };
  }
}


// api.js
export const fetchVenues = async (page = 1, limit = 100) => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch venues");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw for handling in Home.js
  }
};

export const fetchVenueById = async (venueId) => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch listing with ID ${venueId}`); // Throw a more specific error
    }
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching listing with ID ${venueId}:`, error);
    throw error; // Re-throw the error to be handled by the component
  }
};

// Function to fetch the logged-in user's profile using the provided access token, API key, and username
export const fetchLoggedInProfile = async (accessToken, apiKey, name) => {
  try {
    // Check if access token, API key, and username are provided
    if (!accessToken || !apiKey || !name) {
      throw new Error("Access token, API key, or username not found");
    }

    // Construct headers with access token and API key
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    };

    // Construct the endpoint URL with the username
    const endpoint = `https://v2.api.noroff.dev/holidaze/profiles/${name}`;

    // Fetch the profile using the provided access token, API key, and username
    const response = await fetch(endpoint, options);

    // Check if response is successful
    if (!response.ok) {
      // If response is not OK, throw an error with the HTTP status
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    // Parse response JSON data
    const data = await response.json();

    // Check if response data contains the profile data
    if (!data || !data.data) {
      throw new Error("Profile data not found in response");
    }

    // Return the profile data
    return data.data;
  } catch (error) {
    // If an error occurs, throw it to be caught by the caller
    throw new Error(`An error occurred while fetching profile: ${error.message}`);
  }
};

export const createVenue = async (name, description, media, price, maxGuests, accessToken, apiKey) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('maxGuests', maxGuests);

    // Handle media URLs
    formData.append('media[0][url]', media.url);
    formData.append('media[0][alt]', media.alt);

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: formData,
    };

    const endpoint = `https://v2.api.noroff.dev/holidaze/venues`;

    const response = await fetch(endpoint, options);

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      return { success: true, data: responseData };
    } else {
      const errorData = await response.json();
      console.error("Venue creation failed:", errorData);
      return { success: false, error: errorData.message || "Venue creation failed" };
    }
  } catch (error) {
    console.error('Error creating venue:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const fetchLoggedInProfileVenues = async (accessToken, apiKey, name) => {
  try {
    // Check if access token, API key, and username are provided
    if (!accessToken || !apiKey || !name) {
      throw new Error("Access token, API key, or username not found");
    }

    // Construct headers with access token and API key
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    };

    // Construct the endpoint URL with the username
    const endpoint = `https://v2.api.noroff.dev/holidaze/profiles/${name}/venues`;

    // Fetch the profile using the provided access token, API key, and username
    const response = await fetch(endpoint, options);

    // Check if response is successful
    if (!response.ok) {
      // If response is not OK, throw an error with the HTTP status
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    // Parse response JSON data
    const data = await response.json();
    console.log(data)

    // Check if response data contains the profile data
    if (!data || !data.data) {
      throw new Error("Profile data not found in response");
    }

    // Return the profile data
    return data.data;
  } catch (error) {
    // If an error occurs, throw it to be caught by the caller
    throw new Error(`An error occurred while fetching profile: ${error.message}`);
  }
};

// api.js
export const deleteVenue = async (venueId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    if (!accessToken || !apiKey) {
      throw new Error("Access token or API key not found in localStorage.");
    }

    const url = `https://v2.api.noroff.dev/holidaze/venues/${venueId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to delete venue";
      if (response.status === 401) {
        errorMessage = "Unauthorized: Access token or API key is invalid.";
      } else {
        const responseData = await response.json();
        if (responseData.message) {
          errorMessage = responseData.message;
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(`Error deleting venue: ${error.message}`);
  }
};

// Function to update a venue
export const updateVenue = async (venueData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    // Make sure you have the correct endpoint for updating a venue
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueData.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venueData),
    });

    if (!response.ok) {
      throw new Error('Failed to update venue');
    }

    const responseData = await response.json();
    return responseData; // Return the updated venue data if needed
  } catch (error) {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export const createBooking = async (bookingData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");

    const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse error response JSON
      throw new Error(errorData.error || "Failed to create booking"); // Throw error with specific message from API
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error("Error creating booking:", error); // Log the actual error
    throw new Error("Failed to create booking. Please try again later."); // Throw a generic error message
  }
};


