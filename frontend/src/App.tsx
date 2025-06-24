import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Landing from './public/Landing';
import Auth from './public/Auth';
import ProtectedRoute from './components/ProtectedRoute'; // Create this component
import Link from './components/LIink'; // Create this component

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/link" element={ <ProtectedRoute> <Link /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;