import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/theme.css';
import '../styles/ReportsAudit.css'; 
import { VscOutput } from "react-icons/vsc";
import { IoReturnUpBack } from "react-icons/io5";

function ReportsAudit() {
  const [reportData, setReportData] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [searchReport, setSearchReport] = useState('');
  const [searchLogs, setSearchLogs] = useState('');
  
  const [selectedGroup, setSelectedGroup] = useState(null); 

  useEffect(() => {
    fetchReports();
    fetchUserLogs();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/admin/report-summary', {
        withCredentials: true,
      });
      setReportData(res.data);
    } catch (err) {
      console.error('โหลดรายงานล้มเหลว:', err);
    }
  };

  const fetchUserLogs = async () => {
    try {
      const res = await axios.get('/admin/user-logs', {
        withCredentials: true,
      });
      setUserLogs(res.data);
    } catch (err) {
      console.error('โหลดประวัติผู้ใช้ล้มเหลว:', err);
    }
  };

  const exportToExcel = () => {
    window.location.href = 'http://172.18.20.45:8080/admin/export/excel';
  };

  const exportToPDF = () => {
    alert('ฟังก์ชัน Export to PDF ยังซับซ้อนและยังไม่พร้อมใช้งานครับ');
  };

  const filteredReports = reportData.filter(item =>
    item.group_name.toLowerCase().includes(searchReport.toLowerCase())
  );
  
  const filteredLogs = userLogs
    .filter(log => {
      if (!selectedGroup) return false; 
      if (selectedGroup.type === 'Company') {
        return log.company_name === selectedGroup.name;
      }
      if (selectedGroup.type === 'User') {
        return log.username === selectedGroup.name && log.company_name === 'N/A';
      }
      return false;
    })
    .filter(log =>
      log.username.toLowerCase().includes(searchLogs.toLowerCase()) ||
      log.file_name.toLowerCase().includes(searchLogs.toLowerCase()) // ⭐️ (ถูกต้องแล้ว)
    );

  // ⭐️ 1. (เพิ่ม) ฟังก์ชันสำหรับกำหนด CSS Class
  const getActionClass = (action) => {
    switch (action) {
      case 'UPLOAD':
        return 'action-upload';
      case 'DOWNLOAD':
        return 'action-download';
      case 'DELETE':
        return 'action-delete';
      default:
        return '';
    }
  };

  return (
    <div className="main-content-wrapper">
      <div className="admin-page-header">
        
        <div className="admin-page-title">
          <VscOutput size={22} className="icon" /> 
          <h3>รายงานและการตรวจสอบไฟล์</h3>
        </div>
        <div className="export-buttons">
          <button className="btn btn-secondary" onClick={exportToExcel}>ดาวน์โหลด Excel</button>
          <button className="btn btn-accent" onClick={exportToPDF}>ดาวน์โหลด PDF</button>
        </div>

      </div>

      {/* 🔍 ส่วนที่ 1: รายงานสรุป (ตารางบน) */}
      <section className="report-section">
        <h3>
          {selectedGroup 
            ? `กำลังดู: ${selectedGroup.name}`
            : 'รายงานสรุป (คลิกกลุ่มเพื่อดูรายละเอียด)'
          }
        </h3>
        
        {selectedGroup ? (
          <button 
            className="btn btn-secondary" 
            onClick={() => setSelectedGroup(null)}
          >
            <IoReturnUpBack size={16} style={{ marginRight: '5px' }} />
            กลับไปดูสรุป
          </button>
        ) : (
          <div className="search-bar">
            <input
              type="text"
              placeholder=" ค้นหากลุ่มหรือผู้ใช้..."
              value={searchReport}
              onChange={e => setSearchReport(e.g.target.value)}
            />
          </div>
        )}

        {!selectedGroup && (
          <table className="files-table">
            <thead>
              <tr>
                <th>กลุ่ม / ผู้ใช้</th>
                <th>จำนวนไฟล์ทั้งหมด</th>
                <th>อัปโหลดล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((item, index) => (
                  <tr 
                    key={index} 
                    className="clickable-row"
                    onClick={() => setSelectedGroup({ name: item.group_name, type: item.group_type })}
                  >
                    <td>{item.group_name}</td>
                    <td>{item.total_files}</td>
                    <td>{item.total_files > 0 ? new Date(item.last_upload).toLocaleDateString('th-TH') : 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* 🔍 ส่วนที่ 2: ประวัติผู้ใช้ (ตารางล่าง) */}
      {selectedGroup && (
        <section className="report-section">
          <h3> ประวัติการอัปโหลดไฟล์ของ: {selectedGroup.name}</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder=" ค้นหาชื่อผู้ใช้หรือชื่อไฟล์..."
              value={searchLogs}
              onChange={e => setSearchLogs(e.target.value)}
            />
          </div>

          <table className="files-table">
            <thead>
              <tr>
                <th>ชื่อผู้ใช้</th>
                <th>การกระทำ</th>
                <th>ชื่อไฟล์</th>
                <th>ขนาด (MB)</th>
                <th>วันที่</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.username}</td>
                    
                    {/* ⭐️ 2. (แก้ไข) เพิ่ม className ที่นี่ */}
                    <td className={getActionClass(log.action_type)}>{log.action_type}</td>
                    
                    <td>{log.file_name}</td>
                    <td>{(log.file_size_bytes / 1024 / 1024).toFixed(2)}</td>
                    <td>{new Date(log.created_at).toLocaleString('th-TH')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>
                    ไม่พบข้อมูลการอัปโหลดสำหรับกลุ่มนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default ReportsAudit;