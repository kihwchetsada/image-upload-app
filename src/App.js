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
import ActivityLog from './pages/ActivityLog'; 
// Components
import Header from './components/Header.jsx';

// Protected Route: Component นี้ใช้ได้ดีแล้ว
const ProtectedRoute = ({ user, children, allowedRoles = ['admin', 'user'] }) => {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    // ⭐️ 1. เริ่มต้น user state เป็น 'undefined' เพื่อบอกว่า "กำลังโหลด"
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // ⭐️ 2. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
                const res = await axios.get(`/auth/validate`, {
                    withCredentials: true,
                });

                // ⭐️ 3. แก้ไข Logic: Backend ส่งข้อมูล user มาตรงๆ
                if (res.data && res.data.username) {
                    setUser(res.data);
                    // ⭐️ 4. อัปเดต localStorage ให้ตรงกัน
                    localStorage.setItem('user_role', res.data.role); 
                } else {
                    setUser(null);
                    localStorage.removeItem('user_role');
                }
            } catch (err) {
                // ⭐️ 5. ถ้า Validate ล้มเหลว (401) ให้ setUser เป็น null
                console.warn('Auth validate failed:', err.message);
                setUser(null);
                localStorage.removeItem('user_role');
            }
        };

        checkAuth();
    }, []); // ⭐️ รันแค่ครั้งเดียวตอนเปิดเว็บ

    const handleLogout = async () => {
        try {
            // ⭐️ 6. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
            await axios.post(
                `/logout`, 
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.warn('Logout failed (ignored):', err.message);
        } finally {
            // ⭐️ 7. ล้าง State และ localStorage
            localStorage.removeItem('user_role');
            setUser(null);
        }
    };

    // ⭐️ 8. ถ้า user เป็น 'undefined' (กำลังโหลด) ให้แสดงหน้า Loading
    if (user === undefined) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                กำลังโหลดข้อมูลผู้ใช้...
            </div>
        );
    }
    
    return (
        <Router>
            {/* ⭐️ 9. Header จะรับ user state ที่ถูกต้องจาก App.js */}
            <Header user={user} onLogout={handleLogout} /> 

            <Routes>
                {/* ⭐️ 10. ส่ง setUser ให้ LoginPage เพื่ออัปเดต State หลัก */}
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<LoginPage isRegister={true} setUser={setUser} />} /> 
                
                {/* ... (Route อื่นๆ ถูกต้องแล้ว) ... */}
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
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute user={user} allowedRoles={['admin']}>
                            <AdminDashboard user={user} />
                        </ProtectedRoute>
                    }
                />

                    <Route
                        path="/admin/activities"
                        element={
                            <ProtectedRoute user={user} allowedRoles={['admin']}>
                                <ActivityLog />
                            </ProtectedRoute>
                        }
                    />

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