import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5140", // Remplacez par l'URL de votre API
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
