import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReportsAudit.css';

function ReportsAudit() {
  const [reportData, setReportData] = useState([]);
  const [userLogs, setUserLogs] = useState([]);
  const [searchReport, setSearchReport] = useState('');
  const [searchLogs, setSearchLogs] = useState('');

  useEffect(() => {
    fetchReports();
    fetchUserLogs();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://172.18.20.45:8080/admin/report-summary', {
        withCredentials: true,
      });
      setReportData(res.data);
    } catch (err) {
      console.error('โหลดรายงานล้มเหลว:', err);
    }
  };

  const fetchUserLogs = async () => {
    try {
      const res = await axios.get('http://172.18.20.45:8080/admin/user-logs', {
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
    window.location.href = 'http://172.18.20.45:8080/admin/export/pdf';
  };

  // ✅ ฟิลเตอร์ข้อมูลรายงาน
  const filteredReports = reportData.filter(item =>
    item.company_name.toLowerCase().includes(searchReport.toLowerCase())
  );

  // ✅ ฟิลเตอร์ข้อมูล log
  const filteredLogs = userLogs.filter(
    log =>
      log.username.toLowerCase().includes(searchLogs.toLowerCase()) ||
      log.filename.toLowerCase().includes(searchLogs.toLowerCase())
  );

  return (
    <div className="reports-audit">
      <h2>📊 รายงานและการตรวจสอบไฟล์</h2>

      {/* 🔍 ช่องค้นหารายงาน */}
      <section>
        <h3>รายงานสรุปจำนวนไฟล์ต่อบริษัท</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่อบริษัท..."
            value={searchReport}
            onChange={e => setSearchReport(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ชื่อบริษัท</th>
              <th>จำนวนไฟล์ทั้งหมด</th>
              <th>อัปโหลดล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((item, index) => (
                <tr key={index}>
                  <td>{item.company_name}</td>
                  <td>{item.total_files}</td>
                  <td>{new Date(item.last_upload).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>
                  ไม่พบข้อมูลบริษัท
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 🔍 ช่องค้นหา Log */}
      <section>
        <h3>📁 ประวัติการกระทำของผู้ใช้</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่อผู้ใช้หรือชื่อไฟล์..."
            value={searchLogs}
            onChange={e => setSearchLogs(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ชื่อผู้ใช้</th>
              <th>การกระทำ</th>
              <th>ชื่อไฟล์</th>
              <th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.username}</td>
                  <td>{log.action}</td>
                  <td>{log.filename}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>
                  ไม่พบข้อมูลการกระทำของผู้ใช้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <div className="export-buttons">
        <button onClick={exportToExcel}>📘 ดาวน์โหลด Excel</button>
        <button onClick={exportToPDF}>📕 ดาวน์โหลด PDF</button>
      </div>
    </div>
  );
}

export default ReportsAudit;
