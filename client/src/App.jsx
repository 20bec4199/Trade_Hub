import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { Routes, Route } from 'react-router-dom'
import TradeHubHome from './components/home/TradeHub';
import Shop from './components/home/Shop';
import About from './components/home/About';

function App() {
 
  return (
    <Routes>
      <Route path="/" element={<TradeHubHome />} />
       <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} /> 
    </Routes>
  )}

export default App
