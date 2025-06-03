import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { Routes, Route } from 'react-router-dom'
import TradeHubHome from './components/home/TradeHub';
import Shop from './components/home/Shop';
import About from './components/home/About';
import Profile from './components/home/Profile';
import Orders from './components/home/Orders';
import { AuthProvider } from './context/AuthContext';

function App() {
 
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<TradeHubHome />} />
       <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} /> 
       <Route path="/profile" element={<Profile />} /> 
       <Route path="/orders" element={<Orders />} /> 
    </Routes>
    </AuthProvider>
  )}

export default App
