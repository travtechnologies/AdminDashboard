import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    setErrorMessage(""); // Reset error message

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost/admin-dashboard/api/login.php', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const text = await response.text(); // Fetch as text first to debug
      console.log(text);

      try {
        const result = JSON.parse(text); // Try to parse manually

        if (result.success) {
          setEmail(""); // Clear email field
          setPassword(""); // Clear password field
          onLogin(); // Proceed after successful login
        } else {
          setErrorMessage(result.message); // Set error message to display
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        setErrorMessage("Failed to parse server response."); // User-friendly error message
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage("Login failed. Please try again."); // User-friendly error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading} // Disable button when loading
            className={`w-full px-4 py-2 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600'}`}
          >
            {isLoading ? 'Logging in...' : 'Login'} {/* Change button text based on loading state */}
          </button>
        </form>
      </div>
    </div>
  );
}
