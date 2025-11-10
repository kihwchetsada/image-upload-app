import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

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
        {user && <Link to="/upload" className="nav-item">อัปโหลดไฟล์</Link>}
        {user && <Link to="/my-list" className="nav-item">รายการของฉัน</Link>}
        <Link to="/about" className="nav-item">เกี่ยวกับเรา</Link>
        {user?.role === 'ผู้ดูแลระบบ' && <Link to="/admin/dashboard" className="nav-item">แดชบอร์ดผู้ดูแล</Link>}
      </nav>

      {/* ปุ่มขวา */}
      <div className="header-right">
        {user ? (
          <>
            <span className="username">👋 {user.username}</span>
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
