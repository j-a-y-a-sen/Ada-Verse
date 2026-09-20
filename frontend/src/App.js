import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/navbar";

import Home from "./pages/home";
import Algorithms from "./pages/algorithms";
import Notes from "./pages/notes";
import PYQ from "./pages/PYQ";
import Visualizer from "./pages/visualizer";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Algorithms */}
        <Route
          path="/algorithms"
          element={<Algorithms />}
        />

        {/* Notes */}
        <Route
          path="/notes"
          element={<Notes />}
        />

        {/* PYQ */}
        <Route
          path="/pyq"
          element={<PYQ />}
        />

        {/* Visualizer */}
        <Route
          path="/visualizer"
          element={<Visualizer />}
        />

        {/* AI Assistant */}
        <Route
          path="/ai-assistant"
          element={<Chatbot />}
        />
      </Routes>
    </Router>
  );
}

export default App;