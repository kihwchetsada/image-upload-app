import React, { useState, useEffect } from 'react';  // ✅ เพิ่ม useEffect
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';


import HappySoftLogo from '../assets/fileflowz2.png';

const API_URL = 'http://172.18.20.45:8080';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const navigate = useNavigate();

    // ✅ ตรวจสอบ token ทันทีเมื่อเปิดหน้า (จำสถานะล็อกอินไว้)
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const role = localStorage.getItem('user_role');
        if (token && role) {
            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // ส่ง cookie
            });

            const data = await response.json();

            if (response.ok) {
                const { token, role } = data;
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_role', role);

                // ✅ Role-Based Routing
                if (role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/user/dashboard', { replace: true });
                }
            } else {
                setError(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
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
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
                setIsRegistering(false);
            } else {
                setError(data.message || 'การลงทะเบียนล้มเหลว');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
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
