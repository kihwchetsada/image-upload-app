import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import '../styles/LoginPage.css';

import HappySoftLogo from '../assets/fileflowz2.png';

// 2. ใช้ URL เดียวกันกับ App.js
const API_URL = 'http://172.18.20.45:8080';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        try {
            // 3. เปลี่ยนมาใช้ axios.post
            const response = await axios.post(`${API_URL}/login`,
                { username, password }, // data
                { withCredentials: true } // 4. ตั้งค่านี้เพื่อให้ส่ง Cookie
            );

            // 5. ลบ localStorage ทั้งหมดออก
            // เราจะใช้ข้อมูล role แค่เพื่อ "ตัดสินใจ" ว่าจะเด้งไปหน้าไหน
            const { role } = response.data;

            // Role-Based Routing
            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
            
            // 6. รีเฟรชหน้าเพื่อให้ App.js ดึงข้อมูล user ใหม่ (สำคัญ)
            window.location.reload();

        } catch (err) {
            // 7. ปรับปรุงการจัดการ Error ให้รองรับ axios
            if (err.response) {
                setError(err.response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else if (err.request) {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
            } else {
                setError('เกิดข้อผิดพลาดบางอย่าง');
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกข้อมูลสำหรับลงทะเบียน");
            return;
        }

        try {
            // 8. เปลี่ยนมาใช้ axios.post
            await axios.post(`${API_URL}/register`, {
                username, password
            });

            alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
            setIsRegistering(false);
            setUsername('');
            setPassword('');

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'การลงทะเบียนล้มเหลว (อาจมีชื่อผู้ใช้นี้แล้ว)');
            } else {
                setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={HappySoftLogo} alt="HappySoft Logo" className="login-logo" />

                {isRegistering ? <h2>สร้างบัญชีผู้ใช้ใหม่</h2> : <h2>เข้าสู่ระบบ</h2>}

                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">ชื่อผู้ใช้/อีเมล</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">
                        {isRegistering ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
                    </button>
                </form>

                <div className="switch-mode-container">
                    <div className="left-action">
                        <a href="/forgot-password" className="forgot-password">ลืมรหัสผ่าน?</a>
                    </div>
                    <div className="right-action">
                        <button
                            className="register-toggle-button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setUsername('');
                                setPassword('');
                            }}
                        >
                            {isRegistering ? "เข้าสู่ระบบ" : "ลงทะเบียนบัญชีใหม่"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;