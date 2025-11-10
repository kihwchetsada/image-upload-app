import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function HomeDashboard() {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ตรวจสอบ cookie เพื่อดึงข้อมูล user
  useEffect(() => {
    axios.get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // โหลดไฟล์ตามสิทธิ์
  useEffect(() => {
    if (!user) return;
    const fetchFiles = async () => {
      try {
        const url = user?.role === 'ผู้ดูแลระบบ'
          ? 'http://172.18.20.45:8080/admin/files'
          : 'http://172.18.20.45:8080/user/files'; // user ได้ไฟล์ของตนเอง
        const res = await axios.get(url, { withCredentials: true });
        setFiles(res.data);
      } catch {
        setFiles([]);
      }
    };
    fetchFiles();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    navigate('/login', { replace: true });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '1.6em', fontWeight: 'bold' }}>FileFlowz</span>
        </div>

        <nav className="header-nav-center">
          <Link to="/home" className="active">หน้าหลัก</Link>
          <Link to="/uploadimage">อัปโหลดไฟล์</Link>
          <Link to="/my-list">รายการของฉัน</Link>
          <Link to="/about">เกี่ยวกับ</Link>
        </nav>

        <div className="user-info">
          {user && <span>👤 {user.username}</span>}
          <button className="sidebar-btn logout" onClick={handleLogout}>ออกจากระบบ</button>
        </div>
      </header>

      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.username || 'ผู้ใช้'}</h1>
        <p>จัดการไฟล์กิจกรรมของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      <div className="container">
        <h2>ไฟล์ล่าสุด</h2>
        {files.length === 0 ? (
          <p>ยังไม่มีไฟล์อัปโหลด</p>
        ) : (
          <div className="file-list">
            {files.map((file, idx) => (
              <div key={idx} className="timeline">
                <div className="timeline-item">
                  <strong>{file.filename}</strong>
                  <p>บริษัท: {file.company_name || 'ไม่ระบุ'}</p>
                  <p>อัปโหลดโดย: {file.uploader_name || 'ไม่ระบุ'}</p>
                  <p>วันที่: {new Date(file.uploaded_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeDashboard;
