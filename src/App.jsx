import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import Leaderboard from "./Pages/Leaderboard";

import CodeEditor from "./Pages/CodeEditor";
import Results from "./Pages/Results";
import Submissions from "./Pages/Submissions";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Anushka pages */}
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/question-hub" element={<QuestionHub />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Pranjali pages */}
        <Route path="/code-editor" element={<CodeEditor />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/results" element={<Results />} />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/question-hub" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}