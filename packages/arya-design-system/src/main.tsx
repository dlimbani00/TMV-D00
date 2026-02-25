import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import AccessoriesPage from './pages/AccessoriesPage';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AccessoriesPage />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
