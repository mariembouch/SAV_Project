import React, { useState } from "react";
import axios from "./axios";
import './Register.css';

const Register = () => {
  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, 
    setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/Client/register", {
        Nom,
        Prenom,
        Email,
        PasswordHash: Password,
      });
      alert(response.data);
    } catch (error) {
      alert(error.response?.data || "Une erreur s'est produite.");
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom"
          value={Nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prénom"
          value={Prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
