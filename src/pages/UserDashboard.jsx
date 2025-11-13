import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';

function UserDashboard({ user }) {
  const [files, setFiles] = useState([]);
  const [currentWord, setCurrentWord] = useState(0);

  // ✅ คำทักทายแบบคงที่
  const words = ['สวัสดี คุณ,', 'ยินดีต้อนรับ,'];

  useEffect(() => {
    if (user) {
      axios
        .get('/user/files', { withCredentials: true })
        .then((res) => setFiles(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // ✅ หมุนคำทุก 3 วิ — ไม่มี ESLint เตือน
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="home-container">
      <section className="hero">
        <h1 className="greeting">
          <span className="fade-text">{words[currentWord]}</span>{' '}
          <span className="username">{user?.username || 'User'}</span>
        </h1>
        <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
      </section>

      <div className="container">
        <h2>ไฟล์ของฉัน</h2>
        {files.length === 0 ? (
          <p>คุณยังไม่มีไฟล์</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="timeline-item">
              <strong>{file.filename}</strong>
              <p>
                อัปโหลดวันที่:{' '}
                {new Date(file.uploaded_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
