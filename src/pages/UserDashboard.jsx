import React, { useState, useEffect, useMemo } from 'react'; // ⭐️ 1. Import useMemo
import axios from 'axios';
import '../styles/Home.css';
import { VscCloudUpload } from 'react-icons/vsc'; // ⭐️ 1. Import ไอคอน

function UserDashboard({ user }) {
    const [files, setFiles] = useState([]);
    const [currentWord, setCurrentWord] = useState(0);
    const words = ['สวัสดี คุณ,', 'ยินดีต้อนรับ,'];

    useEffect(() => {
        if (user) {
            axios
                .get('/user/files', { withCredentials: true })
                .then((res) => setFiles(res.data))
                .catch((err) => console.error(err));
        }
    }, [user]);

    // ... (ส่วน useEffect ของคำทักทาย เหมือนเดิม) ...
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    // ⭐️ 2. คำนวณสถิติด้วย useMemo
    const uploadsThisMonth = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // กรองไฟล์เฉพาะที่อัปโหลดในเดือนและปีปัจจุบัน
        return files.filter(file => {
            const uploadDate = new Date(file.uploaded_at);
            return uploadDate.getMonth() === currentMonth &&
                   uploadDate.getFullYear() === currentYear;
        }).length; // นับจำนวนไฟล์ที่กรองได้

    }, [files]); // ⭐️ คำนวณใหม่เมื่อ files เปลี่ยนแปลง

    return (
        <div className="home-container">
            <section className="hero">
                <h1 className="greeting">
                    <span className="fade-text">{words[currentWord]}</span>{' '}
                    <span className="username">{user?.username || 'User'}</span>
                </h1>
                <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
            </section>

            {/* ⭐️ 1. เพิ่ม Wrapper ใหม่ครอบ 2 กล่อง ⭐️ */}
            <div className="dashboard-content-wrapper">

                {/* ⭐️ 2. ย้ายกล่องสถิติมาไว้ข้างใน ⭐️ */}
                <section className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon upload">
                            <VscCloudUpload size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{uploadsThisMonth}</span> 
                            <span className="stat-label">ไฟล์ที่อัปโหลดในเดือนนี้</span>
                        </div>
                    </div>
                </section>

                {/* ⭐️ 3. ย้ายกล่องไฟล์ของฉันมาไว้ข้างใน ⭐️ */}
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

            </div> {/* ⭐️ สิ้นสุด Wrapper ⭐️ */}
        </div>
    );
}

export default UserDashboard;