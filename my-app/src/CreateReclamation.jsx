import React, { useState } from "react";
import axios from "./axios";

const CreateReclamation = () => {
  const [sujet, setSujet] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientData = JSON.parse(localStorage.getItem("clientData"));
    if (!clientData) {
      alert("Veuillez vous connecter avant de créer une réclamation.");
      return;
    }

    try {
      await axios.post("/api/Reclamation/create", {
        sujet,
        description,
        clientId: clientData.id,
      });
      alert("Réclamation créée avec succès !");
    } catch (error) {
      alert(error.response?.data || "Une erreur s'est produite.");
    }
  };

  return (
    <div>
      <h2>Créer une réclamation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sujet"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default CreateReclamation;
