import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axios"; // Assurez-vous que axios est correctement configuré
import './Admin.css';

const Admin = () => {
  const [reclamations, setReclamations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer toutes les réclamations
    const fetchReclamations = async () => {
      try {
        const response = await axios.get(`/api/Reclamation`);
        const reclamationsData = response.data.$values;

        // Ajouter les informations du client et de l'article dans chaque réclamation
        const enrichedReclamations = reclamationsData.map(reclamation => {
          // Vérifier si le client et l'article existent, puis extraire les informations
          const client = reclamation.client ? `${reclamation.client.nom} ${reclamation.client.prenom}` : "Non disponible";
          const article = reclamation.article ? reclamation.article.title : "Non disponible";

          // Si l'article ou le client est une référence (comme $ref), il faut déballer l'objet
          const clientDetails = reclamation.client ? reclamation.client : null;
          const articleDetails = reclamation.article ? reclamation.article : null;

          return {
            ...reclamation,
            clientDetails,
            articleDetails,
            clientName: client,
            articleTitle: article
          };
        });

        setReclamations(enrichedReclamations);
      } catch (error) {
        console.error("Erreur lors de la récupération des réclamations :", error);
        alert("Erreur lors de la récupération des réclamations.");
      }
    };

    fetchReclamations();
  }, []);

  const handleAddIntervention = (reclamationId) => {
    navigate(`/add-intervention/${reclamationId}`);
  };

  return (
    <div>
      <h2>Liste des réclamations (Admin)</h2>
      <div className="container">
        {reclamations.map((reclamation) => (
          <div className="card" key={reclamation.id}>
            <h4>Réclamation ID : {reclamation.id}</h4>
            <p>Client : {reclamation.clientName}</p>
            <p>Article : {reclamation.articleTitle}</p>
            <p>Sujet : {reclamation.sujet || "Non défini"}</p>
            <p>Description : {reclamation.description || "Non définie"}</p>
            <button onClick={() => handleAddIntervention(reclamation.id)}>
              Ajouter Intervention
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Admin;
