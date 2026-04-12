import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SplashScreen from './pages/SplashScreen'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Build from './pages/Build'
import CoverLetter from './pages/CoverLetter'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/build" element={<Build />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)