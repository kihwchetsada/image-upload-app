import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ⭐️ 1. Import Link
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VscHistory, VscCloudUpload, VscCloudDownload, VscTrash, VscEdit, VscFile } from "react-icons/vsc";
import '../styles/DashboardSummary.css';

const DashboardSummary = () => {
    const [summary, setSummary] = useState({ companies: 0, users: 0, files: 0 });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // API สำหรับ Summary
        axios.get('http://172.18.20.45:8080/admin/summary', { withCredentials: true })
            .then(res => {
                const data = res.data;
                setSummary({
                    companies: data.total_companies,
                    users: data.total_users,
                    files: data.total_files,
                });
            })
            .catch(err => console.error(err));

        // API สำหรับดึง Activity Log (ยังคงดึงแค่ 2 รายการสำหรับหน้า dashboard)
        axios.get('http://172.18.20.45:8080/admin/files', { withCredentials: true })
            .then(res => setRecentActivity(res.data.slice(0, 3)))
            .catch(err => console.error(err));
    }, []);

    const formatDate = date => new Date(date).toLocaleString();

    // --- ฟังก์ชันสำหรับ Activity Log (แก้ไข Case) ---
    const formatActionType = (action) => {
        switch (action) {
            case 'UPLOAD': return 'อัปโหลดไฟล์';
            case 'DOWNLOAD': return 'ดาวน์โหลดไฟล์';
            case 'DELETE': return 'ลบไฟล์';
            case 'EDIT': return 'แก้ไขข้อมูล';
            default: return 'ดำเนินการ (' + action + ')';
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'UPLOAD': return <VscCloudUpload size={20} style={{ color: '#007bff' }} />;
            case 'DOWNLOAD': return <VscCloudDownload size={20} style={{ color: '#28a745' }} />;
            case 'DELETE': return <VscTrash size={20} style={{ color: '#dc3545' }} />;
            case 'EDIT': return <VscEdit size={20} style={{ color: '#ffc107' }} />;
            default: return <VscFile size={20} />;
        }
    };

    // --- ⭐️ ข้อมูลกราฟ (นำกลับมา) ---
    const chartData = [
        { name: 'บริษัท', value: summary.companies },
        { name: 'ผู้ใช้', value: summary.users },
        { name: 'ไฟล์', value: summary.files },
    ];

    return (
        <div className="dashboard-summary-container">

            {/* --- ⭐️ ส่วนกราฟ (โค้ดเดิมของคุณ) --- */}
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

            {/* --- ส่วน Activity Log (โค้ดที่แก้ไขแล้ว) --- */}
            <div className="admin-content-box">

                {/* ⭐️ 2. แก้ไขส่วนหัว H3 ให้มี Link "ดูทั้งหมด" */}
                <div className="admin-box-header">
                    <h3><VscHistory size={20} style={{ marginRight: '8px' }} />กิจกรรมล่าสุด</h3>
                    <Link to="/admin/activities" className="view-all-link">
                        ดูทั้งหมด
                    </Link>
                </div>
                {/* ---------------------------------------- */}

                {recentActivity.length === 0 ? (
                    <p>ยังไม่มีกิจกรรม</p>
                ) : (
                    recentActivity.map(log => (
                        <div key={log.id} className="timeline-item-activity">
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

export default DashboardSummary;