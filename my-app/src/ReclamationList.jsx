import React, { useEffect, useState } from "react";
import axios from "./axios"; // Assurez-vous que axios est correctement configuré
import { useNavigate } from "react-router-dom";
import './ReclamationList.css';

// Fonction pour résoudre les références dans les données
const resolveReferences = (data) => {
  const idMap = {};

  // Étape 1 : Indexer tous les objets par leur `$id`
  const traverseAndIndex = (obj) => {
    if (obj && obj.$id) {
      idMap[obj.$id] = obj;
    }
    Object.values(obj || {}).forEach((value) => {
      if (typeof value === "object" && value !== null) {
        traverseAndIndex(value);
      }
    });
  };

  traverseAndIndex(data);

  // Étape 2 : Remplacer les `$ref` par les objets correspondants
  const replaceRefs = (obj) => {
    if (obj && obj.$ref) {
      return idMap[obj.$ref];
    }
    Object.keys(obj || {}).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = replaceRefs(obj[key]);
      }
    });
    return obj;
  };

  return replaceRefs(data);
};

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const clientData = JSON.parse(localStorage.getItem("clientData"));

    if (!clientData) {
      navigate("/"); // Rediriger vers la page de connexion si le client n'est pas connecté
      return;
    }

    const fetchReclamations = async () => {
      try {
        const response = await axios.get(`/api/Reclamation/client/${clientData.id}`);
        const resolvedData = resolveReferences(response.data);
        const reclamationsData = resolvedData.$values || [];

        for (let reclamation of reclamationsData) {
          try {
            // Récupérer l'intervention pour chaque réclamation
            const interventionResponse = await axios.get(`/api/Intervention/reclamation/${reclamation.id}`);
            const intervention = interventionResponse.data;

            // Extraire les pièces de rechange
            const piecesDeRechange = intervention.piecesDeRechange?.$values.map((item) => ({
              id: item.pieceDeRechange.id,
              nom: item.pieceDeRechange.nom,
              description: item.pieceDeRechange.description,
              prix: item.pieceDeRechange.prix,
            }));

            // Ajouter l'intervention et ses pièces à la réclamation
            reclamation.interventions = { ...intervention, piecesDeRechange };
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'intervention pour la réclamation ${reclamation.id}:`, error);
          }
        }

        setReclamations(reclamationsData); // Mettre à jour l'état avec les données complètes
      } catch (error) {
        console.error("Erreur lors de la récupération des réclamations :", error);
        alert("Erreur lors de la récupération des réclamations.");
      }
    };

    fetchReclamations();
  }, [navigate]);

  return (
    <div>
      <h2>Liste des réclamations</h2>
      <button onClick={() => navigate("/articles")}>Retour à mes articles</button>

      {reclamations.length > 0 ? (
        <ul>
          {reclamations.map((reclamation) => (
            <li key={reclamation.id}>
              <h4>Sujet : {reclamation.sujet || "Non défini"}</h4>
              <p>Description : {reclamation.description || "Non défini"}</p>
              <p>Statut : {reclamation.etat || "Non défini"}</p>
              <p>Article concerné : {reclamation.article?.title || "Article non disponible"}</p>

              {/* Affichage de l'intervention associée */}
              {reclamation.interventions ? (
                <div>
                  <h5>Intervention associée :</h5>
                  <p>Statut de l'intervention : {reclamation.interventions.etat || "Non défini"}</p>
                  <p>Description de l'intervention : {reclamation.interventions.description || "Aucune description"}</p>

                  {/* Affichage des pièces de rechange */}
                  {reclamation.interventions.piecesDeRechange?.length > 0 ? (
                    <div>
                      <h6>Pièces de rechange :</h6>
                      <ul>
                        {reclamation.interventions.piecesDeRechange.map((piece) => (
                          <li key={piece.id}>
                            <p>Nom : {piece.nom}</p>
                            <p>Description : {piece.description}</p>
                            <p>Prix : {piece.prix} €</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Aucune pièce de rechange associée.</p>
                  )}
                </div>
              ) : (
                <p>Aucune intervention associée.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune réclamation trouvée.</p>
      )}
    </div>
  );
};

export default ReclamationList;
