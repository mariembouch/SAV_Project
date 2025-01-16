import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./axios";
import './AddIntervention.css';

const AddIntervention = () => {
  const { reclamationId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [dateIntervention, setDateIntervention] = useState("");
  const [piecesDeRechange, setPiecesDeRechange] = useState([]);
  const [selectedPieces, setSelectedPieces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInterventionId, setNewInterventionId] = useState(null);

  useEffect(() => {
    // Récupérer toutes les pièces de rechange
    const fetchPiecesDeRechange = async () => {
      try {
        const response = await axios.get(`/api/PieceDeRechange/all`);
        setPiecesDeRechange(response.data.$values); // Ajuster selon la structure de la réponse
      } catch (error) {
        console.error("Erreur lors de la récupération des pièces :", error);
        alert("Erreur lors de la récupération des pièces.");
      }
    };

    fetchPiecesDeRechange();
  }, []);

  const handleAddPiece = (piece) => {
    if (!selectedPieces.find((p) => p.id === piece.id)) {
      setSelectedPieces([...selectedPieces, piece]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const interventionData = {
      description,
      dateIntervention: new Date(dateIntervention).toISOString(),
      reclamationId: parseInt(reclamationId, 10),
    };

    try {
      // Ajouter l'intervention sans pièces de rechange
      const response = await axios.post("/api/Intervention/add", interventionData);

      setNewInterventionId(response.data.id); // Récupérer l'ID de la nouvelle intervention
      console.log(response.data.id);
      alert("Intervention ajoutée avec succès !");
      setIsModalOpen(true); // Ouvrir le modal pour les pièces de rechange
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'intervention :", error);
      alert("Erreur lors de l'ajout de l'intervention.");
    }
  };

  const handleAddPieces = async () => {
    try {
      const piecesIds = selectedPieces.map((piece) => piece.id);
      await axios.post(`/api/Intervention/${newInterventionId}/add-pieces`, piecesIds);
      alert("Pièces ajoutées avec succès !");
      setIsModalOpen(false);
      navigate("/admin"); // Redirection après succès
    } catch (error) {
      console.error("Erreur lors de l'ajout des pièces :", error);
      alert("Erreur lors de l'ajout des pièces.");
    }
  };

  return (
    <div>
      <h2>Ajouter une intervention</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Date d'intervention :</label>
          <input
            type="date"
            value={dateIntervention}
            onChange={(e) => setDateIntervention(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter Intervention</button>
      </form>

      {isModalOpen && (
        <div className="modal">
          <h3>Voulez-vous ajouter des pièces de rechange à cette intervention ?</h3>
          <div>
            <label>Pièces de rechange disponibles :</label>
            <select
              onChange={(e) =>
                handleAddPiece(
                  piecesDeRechange.find((p) => p.id === parseInt(e.target.value))
                )
              }
            >
              <option value="">-- Sélectionnez une pièce --</option>
              {piecesDeRechange.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.nom} - {piece.description} ({piece.prix} €)
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4>Pièces sélectionnées :</h4>
            <ul>
              {selectedPieces.map((piece) => (
                <li key={piece.id}>
                  {piece.nom} - {piece.description} ({piece.prix} €)
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleAddPieces}>Ajouter les pièces</button>
          <button onClick={() => setIsModalOpen(false)}>Annuler</button>
        </div>
      )}
    </div>
  );
};

export default AddIntervention;
