import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/instagram",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
