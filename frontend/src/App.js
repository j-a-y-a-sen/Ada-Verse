import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/home';
import Algorithms from './pages/algorithms';
import Notes from './pages/notes';
import PYQ from './pages/PYQ';
import Visualizer from './pages/visualizer';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<Algorithms />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </Router>
  );
}

export default App;