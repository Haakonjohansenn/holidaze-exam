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
    const response = await fetch(`https://v2.api.noroff.dev/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const responseData = await response.json();
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
export const fetchListings = async () => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues`);
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const fetchListingById = async (listingId) => {
  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${listingId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch listing with ID ${listingId}`); // Throw a more specific error
    }
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching listing with ID ${listingId}:`, error);
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
    const endpoint = `https://v2.api.noroff.dev/auction/profiles/${name}`;

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

