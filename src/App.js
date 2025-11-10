import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import UploadImage from './pages/UploadImage.jsx';
import HomeDashboard from './pages/HomeDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Components
import Header from './components/Header.jsx';

// 1. ⭐️ เพิ่ม URL ของ Backend
const API_URL = 'http://172.18.20.45:8080';

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    // 2. ⭐️ แก้ไข URL ให้ถูกต้อง
    axios.get(`${API_URL}/auth/validate`, { withCredentials: true })
        .then(res => setUser(res.data || null)) 
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    // 2. ⭐️ แก้ไข URL ให้ถูกต้อง
    axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
        .then(() => {
        setUser(null);
        // สั่งให้รีเฟรชหน้าเพื่อเคลียร์สถานะทั้งหมด
        window.location.href = '/login'; 
      });
  };

  if (user === undefined) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeDashboard user={user} />} />
        <Route path="/upload" element={<UploadImage user={user} />} />
        <Route path="/my-list" element={<MyListPage user={user} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard user={user} />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;