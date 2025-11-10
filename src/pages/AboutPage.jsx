import React from 'react';
import {  } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/AboutPage.css';

function AboutPage() {
  // const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <h1>เกี่ยวกับ Happy Soft</h1>
        <p>ผู้นำด้านนวัตกรรมเทคโนโลยีที่มุ่งมั่นพัฒนาโซลูชันเพื่อขับเคลื่อนธุรกิจไทย</p>
      </section>

      {/* Content Section */}
      <div className="container">
        <h2>วิสัยทัศน์</h2>
        <p>
          เป็นผู้นำในการสร้างสรรค์โซลูชันเทคโนโลยีที่ชาญฉลาดและสร้างผลกระทบเชิงบวกที่ยั่งยืนให้กับธุรกิจและสังคมในประเทศไทยและภูมิภาค
        </p>

        <h2>พันธกิจ</h2>
        <p>
          เป็นพันธมิตรทางเทคโนโลยีที่เชื่อถือได้และสร้างสรรค์ (Trusted & Innovative Technology Partner) สำหรับธุรกิจทุกขนาด
        </p>

        <h2>ค่านิยมหลัก (Core Values)</h2>
        <ul className="value-list">
          <li>มุ่งเน้นลูกค้าเป็นศูนย์กลาง (Customer-Centricity)</li>
          <li>ขับเคลื่อนด้วยนวัตกรรมและความเป็นเลิศ (Innovation & Excellence)</li>
          <li>ซื่อสัตย์และโปร่งใสในทุกขั้นตอน (Integrity & Transparency)</li>
          <li>พลังแห่งการทำงานเป็นทีมและความร่วมมือ (Teamwork & Collaboration)</li>
          <li>ความรับผิดชอบและพัฒนาอย่างไม่หยุดยั้ง (Accountability & Continuous Growth)</li>
        </ul>

        <h2>เส้นทางของเรา</h2>
        <div className="timeline">
          <div className="timeline-item">
            <strong>2023:</strong> ก่อตั้ง Happy Soft และเริ่มพัฒนาโซลูชันซอฟต์แวร์
          </div>
          <div className="timeline-item">
            <strong>ปลายปี 2023:</strong> เปิดตัวระบบสมาชิกออนไลน์
          </div>
          <div className="timeline-item">
            <strong>2024:</strong> ขยายทีมและบริการ Smart Solution
          </div>
          <div className="timeline-item">
            <strong>ปลายปี 2024:</strong> เปิดบริการฝึกอบรมเฉพาะทาง
          </div>
          <div className="timeline-item">
            <strong>2025:</strong> เสริมทัพบริการการตลาดออนไลน์ครบวงจร
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        ร่วมเป็นส่วนหนึ่งของการเดินทางสู่ความสำเร็จกับ Happy Soft
      </footer>
    </div>
  );
}

export default AboutPage;
