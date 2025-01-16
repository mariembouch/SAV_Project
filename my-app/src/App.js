import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import CreateReclamation from "./CreateReclamation";
import ArticleClient from "./ArticleClient";
import ReclamationList from "./ReclamationList";
import Admin from "./Admin";
import AddIntervention from "./AddIntervention";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-reclamation" element={<CreateReclamation />} />
        <Route path="/reclamations" element={<ReclamationList />} />
        <Route path="/ArticleClient" element={<ArticleClient/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-intervention/:reclamationId" element={<AddIntervention />} />
      </Routes>
    </Router>
  );
};

export default App;
