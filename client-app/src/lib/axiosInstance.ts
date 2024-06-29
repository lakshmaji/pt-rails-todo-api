import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000, // example timeout configuration
  headers: {
    "Content-Type": "application/json",
    // FIXME: remove this
    // Authorization: "Bearer 6hCdEPeG7c-1M1lCnmfk2Mfo-sl2vm6Z8MnC_-q692g",
  },
});

// Add any request or response interceptors if needed
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Modify config before request is sent
//     return config;
//   },
//   (error) => {
//     // Handle request error
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Any status code within the range of 2xx causes this function to trigger
//     return response;
//   },
//   (error) => {
//     // Any status codes outside the range of 2xx cause this function to trigger
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
