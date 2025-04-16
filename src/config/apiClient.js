import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import apiUrl from '@/config/apiConfig';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to parse the JWT token and check expiration
function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return payload.exp < currentTime; // Check if token is expired
}

// Function to refresh the access token
async function refreshAccessToken() {
  const refreshToken = Cookies.get('refreshToken'); // Get the refreshToken from cookies

  if (!refreshToken) {
    console.error('No refresh token available');
    return null;
  }

  try {
    const response = await axios.post("https://backend-esz3.onrender.com/api/token/refresh/", {
      refresh: refreshToken
    });

    if (response.status === 200) {
      const { access } = response.data;
      Cookies.set('accessToken', access, { expires: 7 }); // Store the new access token in cookies
      return access;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

// Add a request interceptor to include the Bearer token from cookies
apiClient.interceptors.request.use(async (config) => {
  let accessToken = Cookies.get('accessToken'); // Get the accessToken from cookies

  if (accessToken && isTokenExpired(accessToken)) {
    console.log('Access token expired. Attempting to refresh...');
    accessToken = await refreshAccessToken(); // Refresh the token if expired

    if (!accessToken) {
      console.error('Could not refresh access token. Unauthorized.');
      return Promise.reject(new Error('Unauthorized'));
    }
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`; // Add the (refreshed) token to the headers
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios response interceptor to handle 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response) => response, // Return the response if successful
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      const newAccessToken = await refreshAccessToken(); // Try refreshing the token
      if (newAccessToken) {
        Cookies.set('accessToken', newAccessToken, { expires: 7 }); // Save the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Set the new token in headers

        return apiClient(originalRequest); // Retry the original request with the new token
      }
    }

    return Promise.reject(error); // If the error is not handled, return the error
  }
);

export default apiClient;