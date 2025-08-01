import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => { 
    let token = localStorage.getItem('accessToken') || false;
    
  return (
    token ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoutes
