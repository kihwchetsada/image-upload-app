import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VscFile } from "react-icons/vsc";
import '../styles/DashboardSummary.css'; // ← เผื่อจัดสไตล์เพิ่ม

const DashboardSummary = () => {
  const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
  const [recentFiles, setRecentFiles] = useState([]);

  useEffect(() => {
    axios.get('http://172.18.20.45:8080/admin/summary', { withCredentials: true })
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true })
      .then(res => setRecentFiles(res.data.slice(0,5)))
      .catch(err => console.error(err));
  }, []);

  const formatDate = date => new Date(date).toLocaleString();
  const formatFileSize = bytes => {
    if (!bytes) return '0 Bytes';
    const k = 1024, s = ['Bytes', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + s[i];
  };

  // ✅ แปลงข้อมูลเป็น array สำหรับกราฟ
  const chartData = [
    { name: 'บริษัท', value: summary.companies },
    { name: 'ผู้ใช้', value: summary.users },
    { name: 'ไฟล์', value: summary.files },
  ];

  return (
    <div className="dashboard-summary-container">
      {/* 🎯 กราฟแท่ง */}
      <div className="summary-graph-box">
        <h3>ภาพรวมระบบ</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#007bff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🗂️ ไฟล์ล่าสุด */}
      <div className="admin-content-box">
        <h3><VscFile size={20} style={{ marginRight: '8px' }} />ไฟล์ล่าสุด</h3>
        {recentFiles.length === 0 ? (
          <p>ยังไม่มีไฟล์อัปโหลด</p>
        ) : (
          recentFiles.map(f => (
            <div key={f.id} className="timeline-item">
              <strong>{f.filename}</strong>
              <p>บริษัท: {f.company_name}</p>
              <p>อัปโหลด: {formatDate(f.uploaded_at)}</p>
              <p>ขนาดไฟล์: {formatFileSize(f.filesize_bytes)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardSummary;
