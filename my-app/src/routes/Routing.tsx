import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Auth/Register';
import Login from '@/pages/Auth/Login';
import Home from '@/pages/Home/Home';
import Entry from '@/pages/Home/Entry';

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Entry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/template" element={<Home />} />
    </Routes>
  );
};

export default Routing;
