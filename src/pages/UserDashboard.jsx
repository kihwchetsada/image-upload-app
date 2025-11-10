import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Home.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if(user){
      axios.get('http://172.18.20.45:8080/user/myfiles', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    navigate('/login', { replace: true });
  };

  if(loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-logo" onClick={() => navigate('/home')}>FileFlowz</div>
        <nav>
          <Link to="/home">หน้าหลัก</Link>
          <Link to="/uploadimage">อัปโหลดไฟล์</Link>
          <Link to="/my-list">รายการของฉัน</Link>
          <Link to="/about">เกี่ยวกับ</Link>
        </nav>
        <button onClick={handleLogout} className="sidebar-btn logout">ออกจากระบบ</button>
      </header>

      <section className="hero">
        <h1>ยินดีต้อนรับ, {user?.name}</h1>
        <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      <div className="container">
        <h2>ไฟล์ของฉัน</h2>
        {files.length === 0 ? (
          <p>คุณยังไม่มีไฟล์</p>
        ) : (
          files.map(file => (
            <div key={file.id} className="timeline-item">
              <strong>{file.filename}</strong>
              <p>อัปโหลดวันที่: {new Date(file.uploaded_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
