import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🎨 นำเข้าไอคอนใหม่ทั้งหมด
import { CgAlignBottom, CgBox } from "react-icons/cg";
import { VscAccount } from "react-icons/vsc";
import { VscOutput } from "react-icons/vsc";

import DashboardSummary from "./DashboardSummary.jsx";
import CompanyManagement from "./CompanyManagement.jsx";
import UserManagement from "./UserManagement.jsx";
import ReportsAudit from "./ReportsAudit.jsx";

import "../styles/Dashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("summary");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    navigate("/login", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <DashboardSummary />;
      case "companies":
        return <CompanyManagement />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <ReportsAudit />;
      default:
        return <DashboardSummary />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="main-header">
        <div className="dashboard-logo" onClick={() => setActiveTab("summary")}>
          FileFlowz Admin
        </div>
        <nav className="header-nav">
          <span onClick={() => navigate("/about")}>เกี่ยวกับเรา</span>
        </nav>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={`sidebar-btn ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            <CgAlignBottom size={22} className="icon" />
            แดชบอร์ด
          </button>

          <button
            className={`sidebar-btn ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => setActiveTab("companies")}
          >
            <CgBox size={22} className="icon" />
            จัดการบริษัท
          </button>

          <button
            className={`sidebar-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
             <VscAccount size={22} className="icon" />
            จัดการผู้ใช้
          </button>

          <button
            className={`sidebar-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <VscOutput size={22} className="icon" />
            รายงานและตรวจสอบไฟล์
          </button>

          <div className="sidebar-footer">
            <button className="sidebar-btn logout" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content-wrapper">{renderContent()}</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
