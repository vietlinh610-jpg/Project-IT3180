// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({ hoKhau: false, nhanDan: false });
  const location = useLocation(); // Dùng để xác định trang nào đang active

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  // Hàm kiểm tra xem đường dẫn có đang được chọn không để tô màu
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h3 className="sidebar-title">QUẢN LÝ CHUNG CƯ</h3>
        <div className="logo-section">
          <img src="/images/logo.png" alt="Logo" className="bluemoon-logo" />
        </div>

        <hr className="sidebar-divider" />
        
        <div className="user-info">
          <span className="user-name">Lê Công Dũng</span>
          <p className="user-role">Ban Quản trị</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {/* Menu chính: Trang chủ */}
          <li>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              Trang chủ
            </Link>
          </li>

          {/* Menu chính: Quản lý hộ gia đình */}
          <li className={`has-submenu ${openMenus.hoKhau ? 'open' : ''}`}>
            <div className={`nav-link dropdown-toggle ${isActive('/ho-gia-dinh')}`} onClick={() => toggleMenu('hoKhau')}>
              Quản lý hộ gia đình
              <i className="fas fa-chevron-down arrow"></i>
            </div>
            <ul className="submenu">
              <li><Link to="/ho-gia-dinh/ho-khau">Hộ khẩu</Link></li>
              <li><Link to="/ho-gia-dinh/can-ho">Căn hộ</Link></li>
            </ul>
          </li>

          {/* Menu chính: Quản lý nhân dân */}
          <li className={`has-submenu ${openMenus.nhanDan ? 'open' : ''}`}>
            <div className={`nav-link dropdown-toggle ${isActive('/nhan-dan')}`} onClick={() => toggleMenu('nhanDan')}>
              Quản lý nhân dân
              <i className="fas fa-chevron-down arrow"></i>
            </div>
            <ul className="submenu">
              <li><Link to="/quan-ly-nhan-dan/nhan-khau">Nhân khẩu</Link></li>
              <li><Link to="/quan-ly-nhan-dan/tam-tru">Tạm trú</Link></li>
              <li><Link to="/quan-ly-nhan-dan/tam-vang">Tạm vắng</Link></li>
            </ul>
          </li>

          {/* Menu chính: Quản lý khoản thu */}
          <li>
            <Link to="/quan-ly-khoan-thu" className={`nav-link ${isActive('/khoan-thu')}`}>
              Quản lý khoản thu
            </Link>
          </li>

          {/* Menu chính: Quán lý tài khoản và quyền */}
          <li>
            <Link to="/quan-ly-tai-khoan" className={`nav-link ${isActive('/khoan-thu')}`}>
              Quản lý tài khoản
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;