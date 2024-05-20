import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

const Modal = ({ onClose }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target === document.getElementById("modal-overlay")) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setMessage("");

    const { success, error } = await registerUser(
      name,
      email,
      password,
      avatarURL,
      avatarFile,
      venueManager
    );

    console.log("Register user response:", success, error); // Log the response from registerUser

    if (success) {
      setMessage("Registration successful! Redirecting to homepage...");
      setTimeout(() => {
        router.push("/home");
        onClose(); // Close the modal
      }, 2000);
    } else {
      console.error("Registration failed:", error);

      if (Array.isArray(error)) {
        // Display each error message from the array
        setMessage(`Registration failed: ${error.join(", ")}`);
      } else if (error && error.message) {
        // Display the actual error message
        setMessage(`Registration failed: ${error.message}`);
      } else {
        setMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20"
    >
      <div className="bg-white p-8 rounded-lg w-2/3">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              className={`w-full p-3 text-sm border rounded-lg h-10 ${
                errors.name ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              className={`w-full p-3 text-sm border rounded-lg h-10 ${
                errors.email ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              className={`w-full p-3 border rounded-lg h-10 text-sm ${
                errors.password ? "border-red-500" : ""
              }`}
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="avatarURL">
              Avatar URL (Optional)
            </label>
            <input
              className="w-full px-1 text-sm py-2 border rounded-lg"
              type="text"
              id="avatarURL"
              name="avatarURL"
              value={avatarURL}
              onChange={(e) => setAvatarURL(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="avatarFile"
            >
              Avatar File (Optional)
            </label>
            <input
              className="w-full px-1 text-sm py-2 border rounded-lg"
              type="file"
              id="avatarFile"
              name="avatarFile"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </div>
          <div className="mb-4 gap-6 flex flex-row mx-auto">
            <label className="text-sm text-nowrap">Venue Manager?</label>
            <input
              className="border rounded-lg text-sm mx-auto"
              type="checkbox"
              id="venuemanager"
              name="venuemanager"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)} // Toggle venueManager state to true when checked
            />
          </div>
          <div className="flex justify-center p-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 flex justify-center bg-cta-color w-2/3 text-white rounded-lg hover:opacity-40"
            >
              <p className="text-lg font-semibold text">Register</p>
            </button>
          </div>
        </form>
        {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
        <button
          className="mt-4 text-sm mx-auto flex justify-center text-gray-600 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
