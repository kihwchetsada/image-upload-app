import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import UploadImage from './pages/UploadImage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; // ⭐️ ใช้ Dashboard ใหม่

// Components
import Header from './components/Header.jsx';

// ⭐️ (ใช้ ProtectedRoute จากไฟล์ใหม่ของคุณ)
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Backend URL
const API_URL = 'http://172.18.20.45:8080';

function App() {
    const [user, setUser] = useState(undefined);

    // ⭐️ 1. ใช้ useEffect แบบง่าย (นี่คือ checkAuth ที่ถูกต้อง)
    useEffect(() => {
        axios.get(`${API_URL}/auth/validate`, { withCredentials: true })
            .then(res => {
                // ⭐️ 2. Backend (Go) ส่งข้อมูล user มาตรงๆ (res.data)
                // ไม่ได้ซ้อนใน res.data.user
                setUser(res.data || null); 
            })
            .catch(() => {
                setUser(null);
            });
    }, []); // ทำงานครั้งเดียวตอนโหลด

    const handleLogout = async () => {
        try {
            // ⭐️ 3. เรียก /logout (ตามที่แก้ Error 404 ไป)
            await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        } catch (err) {
            console.warn('Logout failed (ignored):', err.message);
        } finally {
            // 4. ⭐️ ห้ามยุ่งกับ localStorage
            setUser(null);
            window.location.href = '/login';
        }
    };

    if (user === undefined) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                กำลังโหลดข้อมูลผู้ใช้...
            </div>
        );
    }

    return (
        <Router>
            <Header user={user} onLogout={handleLogout} />

            <Routes>
                {/* 5. ⭐️ ลบ props (setUser) ออก */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage isRegister={true} />} />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        user ? (
                            user.role === 'admin' ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Navigate to="/user/dashboard" replace /> // ⭐️ ไปที่ user/dashboard
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* For backward compatibility */}
                <Route
                    path="/home" // ⭐️ /home ก็จะเด้งไปที่ถูกต้อง
                    element={
                        user ? (
                            user.role === 'admin' ? (
                                <Navigate to="/admin/dashboard" replace />
                            ) : (
                                <Navigate to="/user/dashboard" replace />
                            )
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* User Routes */}
                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <UploadImage user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-list"
                    element={
                        <ProtectedRoute user={user}>
                            <MyListPage user={user} />
                        </ProtectedRoute>
                    }
                />
                <Route path="/about" element={<AboutPage />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <AdminDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                {/* User Dashboard */}
                <Route
                    path="/user/dashboard" // ⭐️ ใช้ Route ใหม่
                    element={
                        <ProtectedRoute user={user} allowedRoles={['user']}>
                            <UserDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App;