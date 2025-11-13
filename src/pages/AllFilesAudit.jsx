import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; 

// ⭐️ (แนะนำ) Import CSS สำหรับปุ่มแบ่งหน้า
import '../styles/Pagination.css'; 

const AllFilesAudit = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState({
    company: '',
    startDate: '',
    endDate: ''
  });
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // --- ⭐️ 1. เพิ่ม State สำหรับการแบ่งหน้า ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ⬅️ กำหนดให้แสดง 10 ไฟล์ต่อหน้า

  // ดึงไฟล์ทั้งหมด
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get('/admin/files', { withCredentials: true });
        setFiles(res.data);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลไฟล์ทั้งหมดได้');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // ฟอร์แมตขนาดไฟล์
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(2) + ' ' + sizes[i];
  };

  // จัดการ Checkbox
  const handleSelectFile = (fileId) => {
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId);
      } else {
        newSelected.add(fileId);
      }
      return newSelected;
    });
  };

  // ลบไฟล์ที่เลือก (Admin)
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (window.confirm(`[Admin] คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedFiles.size} ไฟล์ที่เลือก?`)) {
      try {
        const res = await axios.post('/admin/files/delete', 
          { ids: [...selectedFiles] }, 
          { withCredentials: true }
        );
        alert(res.data.message);
        setFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        setSelectedFiles(new Set()); 
      } catch (err) {
        console.error("Admin Delete failed:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์ (Admin)");
      }
    }
  };

  // ตัวกรองไฟล์ (Client-side)
  const filteredFiles = files.filter(file => {
    const matchCompany = filter.company ? file.company_name === filter.company : true;
    const matchStart = filter.startDate ? new Date(file.created_at) >= new Date(filter.startDate) : true;
    const matchEnd = filter.endDate ? new Date(file.created_at) <= new Date(filter.endDate) : true;
    return matchCompany && matchStart && matchEnd;
  });

  // รายชื่อบริษัทไม่ซ้ำ สำหรับ dropdown
  const companies = [...new Set(files.map(f => f.company_name))];

  // --- ⭐️ 2. คำนวณ Logic การแบ่งหน้า ---
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  
  // ⭐️ ได้ไฟล์เฉพาะหน้าปัจจุบัน
  const currentFiles = filteredFiles.slice(firstIndex, lastIndex); 

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedFiles(new Set()); // ⭐️ เคลียร์ Checkbox เมื่อเปลี่ยนหน้า
  };
  
  // ฟังก์ชันสำหรับสร้างปุ่มตัวเลข
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p>กำลังโหลดรายการไฟล์ทั้งหมด...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;

  return (
    <div className="admin-content-box">
      <h3>📁 ดูไฟล์ทั้งหมด ({filteredFiles.length})</h3>

      {/* Filter Controls (เหมือนเดิม) */}
      <div className="filter-controls">
        <select
          value={filter.company}
          onChange={e => setFilter({ ...filter, company: e.target.value })}
        >
          <option value="">ดูทุกบริษัท</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="date"
          value={filter.startDate}
          onChange={e => setFilter({ ...filter, startDate: e.target.value })}
        />
        <input
          type="date"
          value={filter.endDate}
          onChange={e => setFilter({ ...filter, endDate: e.target.value })}
        />
        <button onClick={() => setFilter({ company:'', startDate:'', endDate:'' })}>
          รีเซ็ต
        </button>
        <button 
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={selectedFiles.size === 0}
          style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: 'auto' }} 
        >
          [Admin] ลบไฟล์ที่เลือก ({selectedFiles.size})
        </button>
      </div>

      {/* File List (ตาราง) */}
      <table className="files-table">
        <thead>
          <tr>
            <th>เลือก</th>
            <th>ชื่อไฟล์</th>
            <th>ผู้ใช้</th>
            <th>บริษัท</th>
            <th>ขนาดไฟล์</th>
            <th>วันที่อัปโหลด</th>
            <th>ดาวน์โหลด</th>
          </tr>
        </thead>
        <tbody>
          
          {/* ⭐️ 3. แก้ไข: map จาก 'currentFiles' (ไม่ใช่ 'filteredFiles') */}
          {currentFiles.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>ไม่พบไฟล์ที่ตรงกับเงื่อนไข</td>
            </tr>
          ) : (
            currentFiles.map(f => (
              <tr key={f.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(f.id)}
                    onChange={() => handleSelectFile(f.id)}
                  />
                </td>
                <td>{f.file_name}</td>
                <td>{f.username}</td>
                <td>{f.company_name}</td>
                <td>{formatFileSize(f.file_size_bytes)}</td>
                <td>{new Date(f.created_at).toLocaleString('th-TH')}</td>
                <td>
                  <a 
                    href={`http://172.18.20.45:8080/files/download?id=${f.id}`} 
                    className="file-action-btn view-btn"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    ดาวน์โหลด
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ⭐️ 4. เพิ่ม: ส่วนควบคุมการแบ่งหน้า */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; ก่อนหน้า
          </button>
          
          {renderPageNumbers()}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป &raquo;
          </button>
        </div>
      )}

    </div>
  );
};

export default AllFilesAudit;