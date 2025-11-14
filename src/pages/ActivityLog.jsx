import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { VscHistory, VscCloudUpload, VscCloudDownload, VscTrash, VscEdit, VscFile } from "react-icons/vsc";
import '../styles/DashboardSummary.css';
import '../styles/ActivityLog.css';

const ActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    // ⭐️ 1. เพิ่ม State สำหรับวันที่
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true })
            .then(res => {
                setActivities(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // --- ฟังก์ชัน Helper (เหมือนเดิม) ---
    const formatDate = date => new Date(date).toLocaleString();

    const formatActionType = (action) => {
        const safeAction = (action || '').trim().toUpperCase();
        switch (safeAction) {
            case 'UPLOAD': return 'อัปโหลดไฟล์';
            case 'DOWNLOAD': return 'ดาวน์โหลดไฟล์';
            case 'DELETE': return 'ลบไฟล์';
            case 'EDIT': return 'แก้ไขข้อมูล';
            default: return 'ดำเนินการ (' + (action || 'N/A') + ')';
        }
    };

    const getActionIcon = (action) => {
        const safeAction = (action || '').trim().toUpperCase();
        switch (safeAction) {
            case 'UPLOAD': return <VscCloudUpload size={20} style={{ color: '#007bff' }} />;
            case 'DOWNLOAD': return <VscCloudDownload size={20} style={{ color: '#28a745' }} />;
            case 'DELETE': return <VscTrash size={20} style={{ color: '#dc3545' }} />;
            case 'EDIT': return <VscEdit size={20} style={{ color: '#ffc107' }} />;
            default: return <VscFile size={20} />;
        }
    };
    // ---------------------------------

    if (loading) {
        return <div className="activity-log-container"><p>กำลังโหลดข้อมูล...</p></div>;
    }

    // ⭐️ 3. อัปเดต Logic การกรอง
    // สร้าง Date object สำหรับเปรียบเทียบ (จัดการเรื่องเวลาเที่ยงคืน)
    const startFilter = startDate ? new Date(startDate) : null;
    if (startFilter) startFilter.setHours(0, 0, 0, 0); // ตั้งเป็น 00:00:00

    const endFilter = endDate ? new Date(endDate) : null;
    if (endFilter) endFilter.setHours(23, 59, 59, 999); // ตั้งเป็น 23:59:59

    const filteredActivities = activities
        .filter(log => {
            // 1. กรองตาม Action Type
            if (!filter) return true; // ถ้าไม่เลือก ก็ผ่าน
            return log.action_type && log.action_type.trim().toUpperCase() === filter;
        })
        .filter(log => {
            // 2. กรองตาม Start Date
            if (!startFilter) return true; // ถ้าไม่เลือก ก็ผ่าน
            return new Date(log.created_at) >= startFilter;
        })
        .filter(log => {
            // 3. กรองตาม End Date
            if (!endFilter) return true; // ถ้าไม่เลือก ก็ผ่าน
            return new Date(log.created_at) <= endFilter;
        });

    return (
        <div className="activity-log-container">
            {/* ⭐️ ส่วนหัวข้อและฟิลเตอร์ (ใช้ space-between) */}
            <div className="activity-log-header">
                <h2><VscHistory size={24} style={{ marginRight: '10px' }} />ประวัติกิจกรรมทั้งหมด</h2>

                {/* ⭐️ กลุ่มฟิลเตอร์ (จัดเรียงลำดับใหม่) ⭐️ */}
                <div className="filters-group">

                    {/* ⭐️ 1. กรองตาม Start Date (ย้ายมาอันแรก) ⭐️ */}
                    <div className="activity-filter-container">
                        <label htmlFor="start-date">ตั้งแต่:</label>
                        <input
                            type="date"
                            id="start-date"
                            className="activity-filter-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {/* ⭐️ 2. กรองตาม End Date (ย้ายมาอันที่สอง) ⭐️ */}
                    <div className="activity-filter-container">
                        <label htmlFor="end-date">ถึง:</label>
                        <input
                            type="date"
                            id="end-date"
                            className="activity-filter-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    {/* ⭐️ 3. กรองตาม Action (ย้ายไปอันสุดท้าย) ⭐️ */}
                    <div className="activity-filter-container">
                        <label htmlFor="activity-filter">กรองตาม:</label>
                        <select
                            id="activity-filter"
                            className="activity-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">ทั้งหมด</option>
                            <option value="UPLOAD">อัปโหลด</option>
                            <option value="DOWNLOAD">ดาวน์โหลด</option>
                            <option value="DELETE">ลบ</option>
                            <option value="EDIT">แก้ไข</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* ⭐️ ส่วนรายการกิจกรรม (เหมือนเดิม) ⭐️ */}
            <div className="activity-list">
                {filteredActivities.length === 0 ? (
                    <p>{(filter || startDate || endDate) ? 'ไม่พบกิจกรรมที่ตรงกับตัวกรอง' : 'ยังไม่มีกิจกรรม'}</p>
                ) : (
                    filteredActivities.map(log => (
                        <div key={`${log.id}-${log.created_at}`} className="timeline-item-activity">
                            {/* ... (โค้ด timeline-item... เหมือนเดิม) ... */}
                            <div className="timeline-icon">
                                {getActionIcon(log.action_type)}
                            </div>
                            <div className="timeline-content">
                                <strong>{formatActionType(log.action_type)}</strong>
                                <p>ไฟล์: {log.file_name}</p>
                                <p>
                                    โดย: <strong className="highlight-username">{log.username || 'ไม่ระบุ'}</strong>
                                    (บริษัท: {log.company_name})
                                </p>
                                <p className="timeline-timestamp">
                                    เวลา: {formatDate(log.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLog;