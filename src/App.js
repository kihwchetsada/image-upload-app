import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Pages
import UploadImage from './pages/UploadImage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';

// Components
import Header from './components/Header.jsx'; // ✅ Import Header ถูกต้องแล้ว

// กำหนด API URL ที่ใช้ในไฟล์นี้ (หากไม่มีในโค้ดต้นฉบับ ให้เพิ่มเอง)
const API_URL = 'http://172.18.20.45:8080';

// Protected Route: Component นี้ใช้ได้ดีแล้ว
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    // เพิ่มการตรวจสอบ role
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // ใช้ API_URL
                const res = await axios.get(`${API_URL}/auth/validate`, {
                    withCredentials: true,
                });

                if (res.data && res.data.user) {
                    setUser(res.data.user);
                    localStorage.setItem('user_role', res.data.user.role); 
                } else {
                    const savedRole = localStorage.getItem('user_role');
                    setUser(savedRole ? { role: savedRole } : null);
                }
            } catch (err) {
                console.warn('Auth validate failed:', err.message);
                const savedRole = localStorage.getItem('user_role');
                setUser(savedRole ? { role: savedRole } : null);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            // ✅ แก้ไข Syntax Error: ใช้ Template Literal (Backticks)
            await axios.post(
                `${API_URL}/auth/logout`, // ใช้ API_URL และ Backticks
                {},
                { withCredentials: true }
            );
            console.log('Logout success');
        } catch (err) {
            console.warn('Logout failed (ignored):', err.message);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_role');
            setUser(null);
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
                {/* Route: Login/Register (Header Component จะซ่อนตัวเองเมื่อ path ตรงกัน) */}
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} /> 
                
                {/* Default route / redirect ตาม role */}
                <Route
                    path="/"
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

                {/* สำหรับ backward compatibility: /home redirect ตาม role */}
                <Route
                    path="/home"
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

                {/* Protected Routes: User */}
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

                {/* Protected Routes: Admin */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <AdminDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes: User Dashboard */}
                <Route
                    path="/user/dashboard"
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