import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../lib/api";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
  
    try {
      const { success, data, error } = await loginUser(email, password);
  
      if (success) {
        setMessage("Welcome! Redirecting to homepage...");
        console.log("Login successful!");
        onLoginSuccess();
        setTimeout(() => {
          router.push("/");
          onClose();
        }, 2000);
      } else {
        console.error("Login failed:", error);
        setMessage("Login failed. Please check your email and password.");
      }
    } catch (error) {
      console.error("An unexpected error occurred during login:", error);
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };  

  return (
    <div id="modal-overlay" className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white p-8 rounded-lg w-2/3">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              className="w-full p-3 text-sm border rounded-lg h-10"
              type="text"
              placeholder="Email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full p-3 border rounded-lg h-10 text-sm"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center p-3 mt-6">
            <button
              type="submit"
              className="px-4 py-2 flex justify-center bg-cta-color w-2/3 text-white rounded-lg hover:opacity-40"
            >
              <p className="text-lg font-semibold text">Login</p>
            </button>
          </div>
        </form>
        <p className="text-center text-sm mt-4 text-red-500">{message}</p>
        <button className="mt-4 text-sm mx-auto flex justify-center text-gray-600 hover:underline" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
