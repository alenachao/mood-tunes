import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplatePage from '@/pages/Template';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/template" element={<TemplatePage />} />
    </Routes>
  );
};

export default Routing;
