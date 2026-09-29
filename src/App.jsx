import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import CodeEditor from "./Pages/CodeEditor";
import Leaderboard from "./Pages/Leaderboard";
import Results from "./Pages/Results";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";
import PublicRoutes from "./ProtectedRoutes/PublicRoutes";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/question-hub" element={<QuestionHub />} />
          <Route path="/question/:id" element={<CodeEditor />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
