import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplatePage from '@/pages/Template';
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';
import PrivateRoute from '@/components/PrivateRoute';

const Routing = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path='/' element={<PrivateRoute component={ HomePage } />} />
      <Route path="/template" element={<TemplatePage />} />
    </Routes>
  );
};

export default Routing;
