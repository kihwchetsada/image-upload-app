import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

function UploadImage({ user }) {
  const [file, setFile] = useState(null);

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  const handleUpload = async () => {
    if (!file) return alert('กรุณาเลือกไฟล์ก่อน!');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://172.18.20.45:8080/upload', formData, { withCredentials: true });
      alert('อัปโหลดสำเร็จ!');
      setFile(null);
    } catch (e) {
      alert('อัปโหลดล้มเหลว');
    }
  };

  return (
    <div>
      <Header user={user} onLogout={() => window.location.reload()} />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>📤 อัปโหลดไฟล์</h2>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <br />
        <button
          onClick={handleUpload}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          อัปโหลด
        </button>
      </div>
    </div>
  );
}

export default UploadImage;
