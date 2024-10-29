import axios from "axios";

// Create an instance of axios with a base URL
const Axios = axios.create({
  baseURL: `${REACT_APP_BASE_URL}/api`, // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors for request/response
Axios.interceptors.request.use(
  (config) => {
    // Add any authorization tokens or modify config if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default Axios;
