import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🎯 1. Import Component หน้าจอหลักที่สร้างไว้ทั้งหมด
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; 
import AboutPage from './pages/AboutPage.jsx'; 

// --- Protected Route Logic ที่ตรวจสอบสิทธิ์ (Role) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
    // 🎯 ดึง Token และ Role จาก Local Storage
    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('user_role');

    if (!token) {
        // ไม่มี Token: บังคับกลับไปหน้า Login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // มี Token แต่ไม่มีสิทธิ์เข้าถึงหน้านี้ (Role ไม่ตรง): 
        
        // บังคับไปหน้า Dashboard ที่ถูกต้องตาม Role ที่มี
        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/user/dashboard" replace />;
    }

    // มี Token และสิทธิ์ถูกต้อง: แสดง Component ที่ต้องการ
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. เส้นทางหน้า Login (ทุกคนเข้าถึงได้) */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* 2. เส้นทางหน้า Admin Dashboard (สำหรับ Admin เท่านั้น) */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 3. 🎯 เส้นทางหน้า User Dashboard (สำหรับ User เท่านั้น) */}
                <Route 
                    path="/user/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* 4. 🎯 เส้นทางหน้า About (Admin/User เข้าถึงได้) */}
                <Route 
                    path="/about" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'user']}>
                            <AboutPage />
                        </ProtectedRoute>
                    } 
                />

                {/* 5. ตั้งค่าเส้นทางหลัก / ให้ตรวจสอบ Token และ Redirect ไปหน้า Dashboard ที่เหมาะสม */}
                <Route 
                    path="/" 
                    element={<Navigate to="/login" replace />} 
                />
                
                {/* 6. หน้า 404 อื่นๆ... */}
                <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
        </Router>
    );
}

export default App;