import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const token = localStorage.getItem("token");


    return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={token ? <Vehicles /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
