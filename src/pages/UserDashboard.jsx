import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; 

// 🔗 กำหนด Base URL ของ Backend
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

// --- Component แสดงรายการไฟล์ (สำหรับ User Dashboard) ---
const MyFilesList = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('auth_token');

    useEffect(() => {
        const fetchMyFiles = async () => {
            if (!token) return; 
            setIsLoading(true);
            try {
                // 🔗 Endpoint ที่ใช้ดึงไฟล์ของผู้ใช้คนนี้เท่านั้น
                const data = await fetcher('/api/user/myfiles', token); 
                setFiles(data); 
                setError(null);
            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลไฟล์ได้ กรุณาตรวจสอบการเชื่อมต่อและสิทธิ์");
                console.error("Fetch files error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyFiles();
    }, [token]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return <p>กำลังโหลดรายการไฟล์...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (files.length === 0) {
        return (
            <div className="admin-content-box">
                <p>คุณยังไม่ได้อัปโหลดไฟล์ใดๆ ในระบบ</p>
                <button className="action-button primary-orange-bg">🚀 อัปโหลดไฟล์ใหม่</button>
            </div>
        );
    }

    return (
        <div className="admin-content-box">
            <h3>📁 ไฟล์ของฉัน ({files.length} รายการ)</h3>
            <button className="action-button primary-orange-bg">+ อัปโหลดไฟล์ใหม่</button>
            
            <table className="files-table">
                <thead>
                    <tr>
                        <th>ชื่อไฟล์</th>
                        <th>ขนาด</th>
                        <th>บริษัท</th>
                        <th>วันที่อัปโหลด</th>
                        <th>การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.id}>
                            <td>{file.filename}</td>
                            <td>{formatFileSize(file.filesize_bytes)}</td>
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
        </div>
    );
};

// --- Component หลัก: User Dashboard ---

function UserDashboard() {
    const [activeTab, setActiveTab] = useState('myfiles'); 
    const [userData, setUserData] = useState(null); 
    const userName = localStorage.getItem('user_name') || 'พนักงาน'; 
    const token = localStorage.getItem('auth_token');
    const navigate = useNavigate();

    // ดึงข้อมูล User Profile (เช่น ชื่อบริษัท) เมื่อโหลด
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) return;
            try {
                const data = await fetcher('/api/user/profile', token); 
                setUserData(data); 
            } catch (error) {
                console.error("User profile fetch failed:", error);
            }
        };
        fetchUserData();
    }, [token]);


    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login', { replace: true }); 
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'myfiles':
                return <MyFilesList />; // 🎯 แสดงรายการไฟล์ของตัวเอง
            case 'profile':
                return <div>[หน้าแก้ไขข้อมูลส่วนตัว]</div>; 
            default:
                return <MyFilesList />;
        }
    };


    return (
        <div className="dashboard-layout">
            <header className="main-header">
                {/* Header (ต้อง Import รูปภาพ HappySoftLogo เข้ามาใช้ด้วย) */}
                <div className="header-logo-container">
                    <span className="logo-text header-logo">HappySoft</span> 
                </div>
                
                <nav className="header-nav">
                    <span className="nav-item active-tab">ไฟล์ของฉัน</span>
                    <span className="nav-item">บริษัทที่สังกัด</span>
                </nav>

                <div className="header-user-info">
                    <span className="company-tag">บริษัท: {userData?.companyName || 'กำลังโหลด...'}</span> 
                    <div className="user-profile">
                        <span className="user-name">{userName}</span>
                        <div className="profile-icon user-icon" onClick={handleLogout}>👤</div>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="sidebar">
                    <button className={`sidebar-btn ${activeTab === 'myfiles' ? 'active' : ''}`} onClick={() => setActiveTab('myfiles')}>
                        📁 ไฟล์ของฉัน
                    </button>
                    <button className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        👤 ข้อมูลส่วนตัว/แก้ไข
                    </button>
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

export default UserDashboard;