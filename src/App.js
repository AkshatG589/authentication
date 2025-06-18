import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import AuthState from "./context/auth/authState";

// Pages
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Forgot from "./auth/Forgot";

function App() {
  return (
    <AuthState>
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/forgot" element={<Forgot />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthState>
  );
}

export default App;