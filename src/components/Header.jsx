import React from 'react';
// ✅ นำเข้า useLocation เพื่อตรวจสอบ URL
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import '../styles/Header.css';

// เพิ่ม Prop isRegister เข้ามาใน LoginPage.jsx และกำหนดใน App.js เพื่อให้แยกแยะได้
const NO_HEADER_PATHS = ['/login', '/register', '/forgot-password'];

function Header({ user, onLogout }) {
    const navigate = useNavigate();
    // ✅ 1. ใช้ useLocation เพื่อดึงข้อมูล path ปัจจุบัน
    const location = useLocation(); 

    // ✅ 2. ตรวจสอบเงื่อนไข: หาก path ปัจจุบันอยู่ในรายการที่กำหนด (Login/Register) ให้ซ่อน Header
    if (NO_HEADER_PATHS.includes(location.pathname)) {
        return null; // ซ่อน Component นี้โดยการคืนค่าเป็น null
    }

    // ✅ แก้ไข: เปลี่ยน 'ผู้ดูแลระบบ' เป็น 'admin' เพื่อให้สอดคล้องกับ App.js และ ProtectedRoute
    const isAdmin = user?.role === 'admin'; 

    return (
        <header className="main-header">
            {/* Logo */}
            <div
                className="logo"
                onClick={() => navigate('/home')}
                style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.5em' }}
            >
                FileFlowz
            </div>

            {/* เมนูกลาง */}
            <nav className="nav-center">
                <Link to="/home" className="nav-item">หน้าหลัก</Link>
                
                {/* แสดงเมนูเมื่อผู้ใช้ล็อกอินแล้ว */}
                {user && <Link to="/upload" className="nav-item">อัปโหลดไฟล์</Link>}
                {user && <Link to="/my-list" className="nav-item">รายการของฉัน</Link>}
                
                <Link to="/about" className="nav-item">เกี่ยวกับเรา</Link>
                
                {/* แสดงเมนู Admin เฉพาะ Admin */}
                {/* ✅ ใช้ isAdmin ที่ตรวจสอบด้วย 'admin' แล้ว */}
                {isAdmin && <Link to="/admin/dashboard" className="nav-item">แดชบอร์ดผู้ดูแล</Link>} 
            </nav>

            {/* ปุ่มขวา */}
            <div className="header-right">
                {user ? (
                    <>
                        {/* ✅ ตรวจสอบว่า user.username มีข้อมูลหรือไม่ก่อนแสดง */}
                        <span className="username">👋 {user.username || 'User'}</span> 
                        <button onClick={onLogout} className="logout-btn">ออกจากระบบ</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/login')} className="login-btn">เข้าสู่ระบบ</button>
                )}
            </div>
        </header>
    );
}

export default Header;