import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import AuthState from "./context/auth/authState";

// Pages
import Home from "./components/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Forgot from "./auth/Forgot";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthState>
      <BrowserRouter>
        <div className="container">
          <Toaster
            position="top-center" // still required for structure
            containerStyle={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
            toastOptions={{
              style: {
                padding: "12px 20px",
                fontSize: "16px",
                textAlign: "center",
              },
            }}
          />
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