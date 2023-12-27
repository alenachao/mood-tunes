import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Template from '@/pages/Template';
import Entry from '@/pages/Entry';
import Home from '@/pages/Home';

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/home" element={<Entry />} />
      <Route path="/template" element={<Template />} />
    </Routes>
  );
};

export default Routing;
