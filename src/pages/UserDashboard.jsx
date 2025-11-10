import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

// 1. ⭐️ เพิ่ม API_URL (เพื่อให้เป็นมาตรฐานเดียวกับไฟล์อื่น)
const API_URL = 'http://172.18.20.45:8080';

// 2. ⭐️ รับ user มาจาก props (ที่ App.js ส่งมาให้)
function UserDashboard({ user }) { 
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ⭐️ เพิ่ม state สำหรับ error
    const navigate = useNavigate();

    // 3. ⭐️ ลบ useEffect (บรรทัด 12-23) ที่เรียก /auth/validate ออกทั้งหมด
    // (เพราะ App.js ทำหน้าที่นี้ให้แล้ว)

    // 4. ⭐️ แก้ไข useEffect นี้ให้ดึง "ไฟล์" เท่านั้น
    useEffect(() => {
        // (ถ้า user (prop) ยังไม่มี ก็ไม่ต้องทำอะไร)
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // 5. ⭐️ แก้ไข URL จาก /user/myfiles เป็น /user/files
        axios.get(`${API_URL}/user/files`, { withCredentials: true }) 
            .then(res => {
                setFiles(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch user files:", err);
                // 6. ⭐️ นี่คือตัวดัก 401 ที่ถูกต้อง (ถ้าคุกกี้หมดอายุจริงๆ)
                if (err.response && err.response.status === 401) {
                    navigate('/login', { replace: true });
                } else {
                    setError('ไม่สามารถโหลดไฟล์ได้');
                }
            })
            .finally(() => {
                setLoading(false);
            });
        
    // 7. ⭐️ ให้ useEffect นี้ทำงานเมื่อ user (prop) เปลี่ยนไป
    }, [user, navigate]);

    // 8. ⭐️ ลบ handleLogout (บรรทัด 33-43) ออก
    // (เพราะ App.js และ Header (ไฟล์แม่) จัดการเรื่องนี้อยู่แล้ว)

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลดข้อมูลไฟล์...</div>;

    // 9. ⭐️ เพิ่มการแสดงผล Error (ถ้ามี)
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div className="home-container">
            {/* 10. ⭐️ ลบ <header> (บรรทัด 49-57) ออก
                (เพราะ App.js แสดง Header ให้อัตโนมัติอยู่แล้ว) */}

            {/* Hero Section */}
            <section className="hero">
                {/* 11. ⭐️ ใช้ user (prop) ที่ได้รับมา */}
                <h1>ยินดีต้อนรับ, {user?.username || 'User'}</h1>
                <p>จัดการไฟล์ของคุณได้ง่าย ๆ ที่นี่</p>
            </section>

            {/* ไฟล์ของ user */}
            <div className="container">
                <h2>ไฟล์ของฉัน</h2>
                {files.length === 0 ? (
                    <p>คุณยังไม่มีไฟล์</p>
                ) : (
                    // ⭐️ (แก้ไขเล็กน้อย) Backend (Go) ส่ง /user/files
                    // (ซึ่งมี id, filename, filesize_bytes, uploaded_at)
                    files.map(file => (
                        <div key={file.id} className="timeline-item">
                            <strong>{file.filename}</strong>
                            <p>อัปโหลดวันที่: {new Date(file.uploaded_at).toLocaleString()}</p>
                            {/* (ถ้าอยากแสดงขนาดไฟล์ ก็ทำได้)
                            <p>ขนาด: {(file.filesize_bytes / 1024).toFixed(2)} KB</p> 
                            */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default UserDashboard;