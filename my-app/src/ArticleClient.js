import React, { useEffect, useState } from "react";
import axios from "./axios"; // Assurez-vous que axios est correctement configuré
import { useNavigate } from "react-router-dom";
import defaultImage from './assets/images/default.jpg'; // Assurez-vous que ce chemin est correct
import './ArticleClient.css';

const importImage = (imageName) => {
  try {
    return require(`./assets/images/${imageName}`);
  } catch (error) {
    return defaultImage; // Retourne l'image par défaut si l'import échoue
  }
};

const ArticleClient = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);  // Pour suivre l'article sélectionné
  const [reclamation, setReclamation] = useState({
    sujet: '',
    description: '',
    clientId: null,
    articleId: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const clientData = JSON.parse(localStorage.getItem("clientData"));
    
    if (!clientData) {
      // Rediriger vers la page de connexion si le client n'est pas connecté
      navigate("/");
      return;
    }

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`/api/Articles/client/${clientData.id}/articles`);
        setArticles(response.data.$values); // Récupérer les articles
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        alert("Erreur lors de la récupération des articles.");
      }
    };

    fetchArticles();
  }, [navigate]);

  // Gérer la sélection d'un article
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    setReclamation({
      sujet: '',
      description: '',
      clientId: JSON.parse(localStorage.getItem("clientData")).id,
      articleId: article.articleId,
    });
  };

  // Gérer la modification du formulaire de réclamation
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReclamation({
      ...reclamation,
      [name]: value,
    });
  };

  // Soumettre la réclamation
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/reclamation', reclamation);
      alert("Réclamation ajoutée avec succès !");
      setSelectedArticle(null); // Réinitialiser après soumission
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réclamation :", error);
      alert("Erreur lors de l'ajout de la réclamation.");
    }
  };

  return (
    <div>
      <h2>Articles de Client</h2>
      <button onClick={() => navigate('/reclamations')}>Afficher mes réclamations</button>

      {articles.length > 0 ? (
        <ul>
          {articles.map((clientArticle) => (
            <li key={clientArticle.articleId}>
              <h3>{clientArticle.article.title}</h3>
              <p>Description : {clientArticle.article.description}</p>
              <p>Prix : {clientArticle.article.price} €</p>
              <img 
                src={importImage(clientArticle.article.photoPath)} 
                alt={clientArticle.article.title} 
                style={{ width: '150px', height: '150px' }} 
              />
              <button onClick={() => handleArticleSelect(clientArticle.article)}>
                Ajouter une réclamation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun article trouvé pour ce client.</p>
      )}

      {/* Formulaire de réclamation */}
      {selectedArticle && (
        <div>
          <h3>Ajouter une réclamation pour : {selectedArticle.title}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="sujet">Sujet</label>
              <input
                type="text"
                id="sujet"
                name="sujet"
                value={reclamation.sujet}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={reclamation.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Envoyer la réclamation</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArticleClient;
