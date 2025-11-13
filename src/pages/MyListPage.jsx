import React, { useEffect, useState } from 'react';
import axios from 'axios';
// ⭐️ 1. ลบ Header (App.js จัดการแล้ว)
// ⭐️ 2. (แนะนำ) Import CSS สำหรับหน้านี้
import '../styles/MyListPage.css';

// ⭐️ 3. รับ 'user' เป็น prop (App.js ส่งมาให้)
function MyListPage({ user }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  // ⭐️ 4. เพิ่ม State สำหรับเก็บไฟล์ที่เลือก
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // ⭐️ 5. แก้ไข useEffect: ลบ /auth/validate ออก (App.js ทำแล้ว)
  useEffect(() => {
    // โหลดไฟล์เฉพาะเมื่อ 'user' (จาก prop) พร้อมใช้งาน
    if (user) {
      setLoading(true);
      // ⭐️ 6. ใช้ Relative Path (เพื่อให้ Proxy ทำงาน)
      axios.get('/user/files', { withCredentials: true })
        .then(res => setFiles(res.data))
        .catch(() => setFiles([]))
        .finally(() => setLoading(false));
    }
  }, [user]); // ⭐️ ให้ re-run เมื่อ 'user' เปลี่ยน

  // ⭐️ 7. ลบ handleLogout (App.js จัดการแล้ว)

  // ⭐️ 8. ฟังก์ชันสำหรับจัดการ Checkbox
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

  // ⭐️ 9. ฟังก์ชันสำหรับลบไฟล์ที่เลือก
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedFiles.size} ไฟล์ที่เลือก?`)) {
      try {
        // ⭐️ 10. เรียก API ใหม่ที่เราสร้างใน Go
        const res = await axios.post('/files/delete-multiple', 
          { ids: [...selectedFiles] }, // ส่ง Array ของ ID
          { withCredentials: true }
        );

        alert(res.data.message);

        // ⭐️ 11. อัปเดต UI โดยลบไฟล์ที่ลบสำเร็จออกจาก State
        setFiles(prevFiles => 
          prevFiles.filter(file => !selectedFiles.has(file.id))
        );
        setSelectedFiles(new Set()); // เคลียร์รายการที่เลือก
        
      } catch (err) {
        console.error("Delete failed:", err);
        alert("เกิดข้อผิดพลาดในการลบไฟล์");
      }
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>กำลังโหลดไฟล์...</div>;

  return (
    // ⭐️ 12. ลบ <div> ครอบและ <Header>
    <div className="mylist-container">
      <div className="mylist-header">
        <h2>📁 ไฟล์ของฉัน</h2>
        <button 
          className="delete-selected-btn"
          onClick={handleDeleteSelected}
          disabled={selectedFiles.size === 0} // ⭐️ 13. ปิดปุ่มถ้ายังไม่เลือก
        >
          ลบไฟล์ที่เลือก ({selectedFiles.size})
        </button>
      </div>

      {files.length === 0 ? (
        <p>ยังไม่มีไฟล์</p>
      ) : (
        <ul className="file-list-ul">
          {files.map(file => (
            <li key={file.id} className="file-list-item">
              <input
                type="checkbox"
                className="file-checkbox"
                checked={selectedFiles.has(file.id)}
                onChange={() => handleSelectFile(file.id)}
              />
              <span className="file-name">{file.filename}</span>
              <span className="file-date">
                {new Date(file.uploaded_at).toLocaleString('th-TH')}
              </span>
              <span className="file-size">
                { (file.file_size_bytes / 1024 / 1024).toFixed(2) } MB
              </span>
              {/* ⭐️ 14. ปุ่ม "ดูไฟล์" (Download) */}
              <a 
                // ✅ ถูก: ชี้ไปที่ Backend (8080) โดยตรง
                href={`http://172.18.20.45:8080/files/download?id=${file.id}`} 
                className="file-action-btn view-btn"
                target="_blank" 
                rel="noopener noreferrer"
              >
                ดูไฟล์
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyListPage;