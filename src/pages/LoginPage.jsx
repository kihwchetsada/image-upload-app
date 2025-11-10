import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. ใช้ axios
import '../styles/LoginPage.css';
import HappySoftLogo from '../assets/fileflowz2.png';

// ใช้ URL เดียวกันกับ App.js
const API_URL = 'http://172.18.20.45:8080';

function LoginPage() { // ⭐️ ห้ามรับ props (setUser)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    // ⭐️ (ลบ useEffect ที่ใช้ localStorage ออก)

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/login`,
                { username, password },
                { withCredentials: true } // ⭐️ ต้องมี
            );

            const { role } = response.data;

            // ⭐️ (ห้ามยุ่งกับ localStorage)
            
            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                // ⭐️ ไปที่ /user/dashboard ให้ตรงกับ App.js
                navigate('/user/dashboard', { replace: true }); 
            }

            // ⭐️ บังคับโหลดใหม่ (สำคัญที่สุด)
            // เพื่อให้ App.js (ไฟล์แม่) โหลดข้อมูล user ใหม่
            window.location.reload();

        } catch (err) {
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
            await axios.post(`${API_URL}/register`, {
                username,
                password,
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

    // ... (ส่วน return JSX ไม่ได้แก้ไข) ...
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
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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