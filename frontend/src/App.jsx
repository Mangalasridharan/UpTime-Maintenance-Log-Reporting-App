import {BrowserRouter, Routes, Route} from "react-router-dom"

import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Machines from "./pages/Machines.jsx"

function App() {

  return (
    <BrowserRouter>
        <Routes>
              <Route path="/" element={<Login/>}/>
        </Routes>
        <Routes>
            <Route path="/register" element={<Register/>}/>
        </Routes>
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/dashboard/machines" element={<Machines/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App
