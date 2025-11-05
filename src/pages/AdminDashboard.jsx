import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

// 🎯 นำเข้ารูปภาพโลโก้
import HappySoftLogo from '../assets/happysoft2.jpg'; 

// 🔗 กำหนด API_URL
const API_URL = 'http://172.18.20.45:8080'; 

// 1. ฟังก์ชันช่วยดึงข้อมูล (Fetcher)
const fetcher = async (endpoint, token) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Component ย่อยสำหรับเนื้อหาหลัก (ใช้สำหรับ Admin) ---

const DashboardSummary = ({ summaryData }) => (
    <div className="summary-cards-container">
        <div className="summary-card primary">
            <h4>รวมจำนวนบริษัท</h4>
            <p>{summaryData?.companies || '...'}</p>
            <span className="details-link">จัดการบริษัท ></span>
        </div>
        <div className="summary-card secondary">
            <h4>รวมจำนวนผู้ใช้ทั้งหมด</h4>
            <p>{summaryData?.users || '...'}</p>
            <span className="details-link">จัดการผู้ใช้ ></span>
        </div>
        <div className="summary-card tertiary">
            <h4>รวมจำนวนไฟล์ทั้งหมด</h4>
            <p>{summaryData?.files || '...'}</p>
            <span className="details-link">ดูไฟล์ทั้งหมด ></span>
        </div>
    </div>
);

const CompanyManagement = () => (
    <div className="admin-content-box">
        <h3>🏢 จัดการบริษัท</h3>
        <button className="action-button primary-orange-bg">+ เพิ่มบริษัทใหม่</button>
        <div className="placeholder-table">
            [ตาราง: ชื่อบริษัท, จำนวนผู้ใช้, จำนวนไฟล์, วันที่สร้าง, การดำเนินการ (แก้ไข/ลบ)]
        </div>
    </div>
);

const UserManagement = () => (
    <div className="admin-content-box">
        <h3>👤 จัดการผู้ใช้</h3>
        <button className="action-button primary-orange-bg">+ เพิ่มผู้ใช้ใหม่</button>
        <div className="placeholder-table">
            [ตาราง: ชื่อผู้ใช้, อีเมล, บริษัทที่สังกัด, สิทธิ์ (Admin/User), การดำเนินการ (รีเซ็ตรหัสผ่าน/ลบ)]
        </div>
    </div>
);

const AllFilesAudit = () => {
    const [allFiles, setAllFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCompany, setFilterCompany] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('auth_token');

    // (ในโค้ดจริงต้องมี useEffect เพื่อ fetch ข้อมูลทั้งหมด)
    
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) { return <p>กำลังโหลดรายการไฟล์ทั้งหมด...</p>; }
    if (error) { return <p style={{ color: 'red' }}>Error: {error}</p>; }
    
    const filteredFiles = allFiles.filter(file => { /* ... (Logic กรองข้อมูล) ... */ });
    const uniqueCompanies = [...new Set(allFiles.map(file => file.company_name).filter(Boolean))];

    return (
        <div className="admin-content-box">
            <h3>📁 ดูไฟล์ทั้งหมด ({filteredFiles.length} / {allFiles.length} รายการ)</h3>
            
            <div className="filter-controls">
                <input
                    type="text"
                    placeholder="ค้นหาตามชื่อไฟล์..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />

                <select 
                    value={filterCompany} 
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="filter-select"
                >
                    <option value="">กรองตามบริษัททั้งหมด</option>
                    {uniqueCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                    ))}
                </select>
                
                <button className="action-button primary-orange-bg">⬇️ ดาวน์โหลดรายงาน (Excel)</button>
            </div>

            <table className="files-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ชื่อไฟล์</th>
                        <th>ขนาด</th>
                        <th>ผู้ใช้</th>
                        <th>บริษัท</th>
                        <th>วันที่อัปโหลด</th>
                        <th>การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFiles.map((file) => (
                        <tr key={file.id}>
                            <td>{file.id}</td>
                            <td>{file.filename}</td>
                            <td>{formatFileSize(file.filesize_bytes)}</td>
                            <td>{file.username}</td> 
                            <td>{file.company_name || 'N/A'}</td>
                            <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                            <td>
                                <button className="table-action-btn download">ดาวน์โหลด</button>
                                <button className="table-action-btn delete">ลบ</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredFiles.length === 0 && <p className="no-results">ไม่พบไฟล์ที่ตรงกับเงื่อนไขการค้นหา</p>}
        </div>
    );
};


const Reporting = () => (
    <div className="admin-content-box">
        <h3>📊 รายงานและตรวจสอบไฟล์</h3>
        <button className="action-button primary-orange-bg">⬇️ ดาวน์โหลดรายงาน (Excel)</button>
        <p>รายงานสรุปจำนวนไฟล์ในแต่ละบริษัท และกราฟการอัปโหลดรายเดือน</p>
        <div className="placeholder-report-chart">
            [กราฟ/ข้อมูล Audit Trail: ประวัติการกระทำของผู้ใช้ (อัปโหลด/ลบ/ดาวน์โหลด)]
        </div>
    </div>
);

// --- Component หลัก: Admin Dashboard ---

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('summary'); 
    const [summaryData, setSummaryData] = useState(null); 
    const userName = 'Admin'; 
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminSummary = async () => {
            if (!token) {
                navigate('/login', { replace: true });
                return;
            }
            // (Logic fetch data)
        };
        // fetchAdminSummary();
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'summary':
                return (
                    <>
                        <DashboardSummary summaryData={summaryData} />
                        <AllFilesAudit /> 
                    </>
                );
            case 'companies':
                return <CompanyManagement />;
            case 'users':
                return <UserManagement />;
            case 'files':
                return <AllFilesAudit />; 
            case 'reports':
                return <Reporting />;
            default:
                return <DashboardSummary summaryData={summaryData} />;
        }
    };

    return (
        <div className="dashboard-layout">
            <header className="main-header">
                
                {/* 1. โลโก้ HappySoft (ใช้รูปภาพ) */}
                <div className="header-logo-container" onClick={() => handleNavigation('/admin/dashboard')}>
                    <img src={HappySoftLogo} alt="HappySoft Logo" className="header-logo-img" />
                </div>
                
                {/* 2. เมนู Header ที่กดได้, จัดกึ่งกลาง, ระยะห่างกว้างขึ้น, ขนาดใหญ่ขึ้น */}
                <nav className="header-nav">
                    <span className="nav-item" onClick={() => setActiveTab('summary')}>หน้าหลัก</span>
                    <span className="nav-item dropdown">บริการ ▼</span>
                    <span className="nav-item" onClick={() => handleNavigation('/about')}>เกี่ยวกับเรา</span>
                </nav>

                {/* 3. ข้อมูลผู้ใช้ Admin */}
                <div className="header-user-info">
                    <span className="admin-tag">รวมทุกบริษัท (ADMIN MODE)</span> 
                    <div className="user-profile">
                        <span className="user-name">{userName}</span> 
                        <div className="profile-icon user-icon" onClick={handleLogout}>👤</div>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                {/* 🎯 SIDEBAR: จัดเรียงปุ่มตามแนวตั้ง */}
                <div className="sidebar">
                    <button 
                        className={`sidebar-btn ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                    >
                        🏠 ภาพรวมระบบ
                    </button>
                    {/* ❌ ลบเส้นคั่นออก */}
                    
                    <button 
                        className={`sidebar-btn ${activeTab === 'companies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('companies')}
                    >
                        🏢 จัดการบริษัท
                    </button>
                    <button 
                        className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👤 จัดการผู้ใช้
                    </button>
                    <button 
                        className={`sidebar-btn ${activeTab === 'files' ? 'active' : ''}`}
                        onClick={() => setActiveTab('files')}
                    >
                        📁 ดูไฟล์ทั้งหมด
                    </button>
                    <button 
                        className={`sidebar-btn ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        📊 รายงานและตรวจสอบ
                    </button>
                    
                    {/* ปุ่มออกจากระบบ (อยู่ด้านล่างสุด) */}
                    <div className="sidebar-footer">
                        <button className="sidebar-btn logout" onClick={handleLogout}>ออกจากระบบ</button>
                    </div>
                </div>
                <div className="main-content-wrapper">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;