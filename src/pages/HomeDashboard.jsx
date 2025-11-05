import React from 'react';
// สมมติว่า role ถูกดึงมาจาก localStorage หลัง Login
const userRole = localStorage.getItem('user_role') || 'user'; 

const HomeDashboard = () => {
    
    // เมนูที่ Admin เท่านั้นที่เห็น
    const adminMenu = [
        { name: 'จัดการระบบ', link: '/admin/management' }
    ];

    // เมนูพื้นฐานสำหรับทุกคน
    const baseMenu = [
        { name: 'หน้าหลัก', link: '/home' },
        { name: 'อัปโหลดไฟล์', link: '/upload' },
        { name: 'รายการของฉัน', link: '/myfiles' }
    ];

    const allMenu = userRole === 'admin' ? [...baseMenu, ...adminMenu] : baseMenu;

    return (
        <div className="dashboard-layout">
            {/* --- TOP TAB BAR (Header) --- */}
            <header className="tab-bar">
                {/* 1. โลโก้ HappySoft */}
                <div className="logo-box">HappySoft</div> 

                {/* 2. เมนู Tab Bar */}
                <nav className="main-nav">
                    {allMenu.map(item => (
                        <div key={item.name} className="tab-item active-tab">
                            {item.name}
                        </div>
                    ))}
                </nav>

                {/* 3. ไอคอนผู้ใช้ */}
                <div className="user-profile-icon">
                    <div className="role-tag">
                       {userRole.toUpperCase()} 
                    </div>
                    <div className="profile-circle">
                       👤 {/* หรือรูปคนจริง */}
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="content-area">
                <div className="hero-section">
                    <h2>อัปโหลดรูปภาพกิจกรรม</h2>
                    <button className="upload-button-lg">
                        🚀 คลิกเพื่ออัปโหลด
                    </button>
                    <p className="role-info">สิทธิ์การใช้งานปัจจุบัน: {userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'บุคคลทั่วไป'}</p>
                </div>

                <h3>กิจกรรมและไฟล์ล่าสุด</h3>
                <div className="file-grid">
                    {/* Placeholder สำหรับรูปภาพกิจกรรม/ไฟล์ล่าสุด */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="file-card">
                            [รูปภาพกิจกรรม {i}]
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HomeDashboard;