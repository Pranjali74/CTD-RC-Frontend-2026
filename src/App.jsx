import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import Leaderboard from "./Pages/Leaderboard";
import "./App.css";

function Placeholder() {
  return <Navigate to="/question-hub" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/question-hub" element={<QuestionHub />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/results" element={<Placeholder />} />
        <Route path="/question/:id" element={<Placeholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
