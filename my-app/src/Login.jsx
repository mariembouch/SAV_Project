import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axios"; // assuming axios is properly configured

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Update the API request to use query parameters in the URL
      const response = await axios.post(
        `/api/Client/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      localStorage.setItem("clientData", JSON.stringify(response.data));
      alert("Connexion réussie !");
      navigate("/ArticleClient");
    } catch (error) {
      alert(error.response?.data || "Identifiants invalides.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
