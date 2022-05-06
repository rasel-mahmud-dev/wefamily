import React from 'react';
import {Link, Outlet, Route, Routes} from "react-router-dom";

const Index = () => {
  return (
    <div className="container">
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/dashboard/home">Home</Link>
      
    </div>
  );
};
export default Index;

