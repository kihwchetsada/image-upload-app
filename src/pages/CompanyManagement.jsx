import React, { useState, useEffect } from "react";
import axios from "axios";
import AddCompanyModal from "../components/AddCompanyModal";
import { CgBox } from "react-icons/cg";
import "../styles/theme.css"; 

// ⭐️ 1. เปลี่ยนเป็นฟังก์ชัน formatBytes ที่ฉลาดกว่า
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'; // ใช้ !+bytes เพื่อดัก 0, null, undefined
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']; // หน่วยที่รองรับ

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i] || 'Bytes'}`;
};

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/admin/companies", { withCredentials: true });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (companyId, companyName) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${companyName}"? (ต้องไม่มี User หรือ File ใดๆ ผูกอยู่)`)) {
      try {
        await axios.delete(`/admin/companies/${companyId}`, { withCredentials: true });
        alert("ลบบริษัทสำเร็จ");
        fetchCompanies(); 
      } catch (err) {
        console.error('Error deleting company:', err);
        alert(err.response?.data?.message || "ลบบริษัทล้มเหลว");
      }
    }
  };

  return (
    <div className="main-content-wrapper">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <CgBox size={22} className="icon" />
          <h3>จัดการบริษัท</h3>
        </div>
        <button
          className="btn btn-accent"
          onClick={() => setShowAddModal(true)}
        >
          + เพิ่มบริษัทใหม่
        </button>
      </div>

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCompanies}
        />
      )}

      {companies.length === 0 ? (
        <p>ไม่พบบริษัท</p>
      ) : (
        <table className="files-table">
          <thead>
            <tr>
              <th>ชื่อบริษัท</th>
              <th>ผู้ใช้</th>
              <th>ไฟล์</th>
              {/* ⭐️ 2. เปลี่ยนหัวตารางให้เหมาะสม */}
              <th>พื้นที่ใช้ไป</th>
              <th>โควต้าทั้งหมด</th>
              <th>พื้นที่คงเหลือ</th>
              <th>วันที่สร้าง</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => {
              
              // ⭐️ 3. คำนวณเป็น Bytes ทั้งหมดเพื่อความแม่นยำ
              const quotaGB = c.storage_quota_gb.Valid ? c.storage_quota_gb.Float64 : 0;
              const quotaBytes = quotaGB * 1024 * 1024 * 1024; // (GB -> Bytes)
              const usedBytes = c.storage_used_bytes || 0;
              
              // ⭐️ 4. สร้างตัวแปรสำหรับแสดงผล
              const usedDisplay = formatBytes(usedBytes); // e.g., "1.50 GB" หรือ "500.20 MB"
              const quotaDisplay = quotaGB > 0 ? `${quotaGB.toFixed(1)} GB` : 'ไม่จำกัด';
              
              let remainingDisplay = 'N/A'; // ค่าเริ่มต้นสำหรับโควต้าไม่จำกัด
              if (quotaBytes > 0) {
                const remainingBytes = quotaBytes - usedBytes;
                // ถ้าติดลบ (ใช้เกิน) ก็จะแสดงค่าติดลบ
                remainingDisplay = formatBytes(remainingBytes); 
              }

              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.user_count}</td>
                  <td>{c.file_count}</td>
                  
                  {/* ⭐️ 5. แสดงผลแบบไดนามิก */}
                  <td>{usedDisplay}</td>
                  <td>{quotaDisplay}</td>
                  <td>{remainingDisplay}</td>
                  
                  <td>{new Date(c.created_at).toLocaleDateString('th-TH')}</td>
                  <td className="action-cell">
                    <button className="table-action-btn edit">
                      แก้ไข
                    </button>
                    <span className="action-divider">|</span>
                    <button 
                      className="table-action-btn delete"
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompanyManagement;