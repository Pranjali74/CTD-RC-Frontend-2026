import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import CodeEditor from "./Pages/CodeEditor";
import Submissions from "./Pages/Submissions";
import Leaderboard from "./Pages/Leaderboard";
import Results from "./Pages/Results";
import FullScreenMonitor from "./Pages/FullScreenMonitor";

import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";
import PublicRoutes from "./ProtectedRoutes/PublicRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/question-hub" element={<QuestionHub />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/monitor" element={<FullScreenMonitor />} />
        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;