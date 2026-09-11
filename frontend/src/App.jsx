import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import DemoPage from "./pages/DemoPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardLayout from "./component/DashboardLayout.jsx";
import MachineDashboard from "./pages/MachineDashboard.jsx";
import ComplaintDashboard from "./pages/ComplaintDashboard.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";
import AssignWorker from "./pages/AssignWorker.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<MachineDashboard />} />
          <Route path="complaints" element={<ComplaintDashboard />} />
          <Route path="complaints/:id/assign" element={<AssignWorker />} />
          <Route path="workers" element={<WorkerDashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
