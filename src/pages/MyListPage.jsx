import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';

function MyListPage() {
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get('http://172.18.20.45:8080/auth/validate', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        return axios.get('http://172.18.20.45:8080/user/files', { withCredentials: true });
      })
      .then(res => setFiles(res.data))
      .catch(() => setFiles([]));
  }, []);

  const handleLogout = () => {
    axios.post('http://172.18.20.45:8080/auth/logout', {}, { withCredentials: true }).then(() => {
      setUser(null);
      window.location.href = '/login';
    });
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      <div style={{ padding: '40px' }}>
        <h2>📁 ไฟล์ของฉัน</h2>
        {files.length === 0 ? (
          <p>ยังไม่มีไฟล์</p>
        ) : (
          <ul>
            {files.map((file, i) => (
              <li key={i}>{file.filename}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyListPage;
