import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUserModal from '../components/AddUserModal';
import { VscAccount } from "react-icons/vsc";
import '../styles/Dashboard.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://172.18.20.45:8080/admin/users', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-content-box">
        <VscAccount size={22} className="icon" />
      <h3> จัดการผู้ใช้</h3>
      <button className="action-button primary-orange-bg" onClick={() => setShowAddModal(true)}>
        + เพิ่มผู้ใช้ใหม่
      </button>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {users.length === 0 ? (
        <p>ไม่พบผู้ใช้</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>บริษัท</th>
              <th>สิทธิ์</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email ?? '-'}</td>
                <td>{u.company_name ?? '-'}</td>
                <td>{u.role}</td>
                <td>รีเซ็ตรหัสผ่าน | ลบ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserManagement;
