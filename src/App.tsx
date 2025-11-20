import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./NavBar";
import { AuthGate } from "./AuthGate";
import { TrackerDashboard } from "./timers/TrackerDashboard";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthGate>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/days" replace />} />
          <Route path="/days" element={<TrackerDashboard />} />
          <Route path="*" element={<Navigate to="/days" replace />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  );
};

export default App;
