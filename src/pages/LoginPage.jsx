// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Sẽ tạo ở Bước 4

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
  e.preventDefault();

  // QUAN TRỌNG: Xóa sạch dữ liệu cũ để tránh xung đột vai trò (Role)
  localStorage.clear();
  
  // Giả lập kiểm tra tài khoản
  if (username === 'admin' && password === '123') {
    localStorage.setItem('userToken', 'token-admin');
    localStorage.setItem('userRole', 'admin');
    navigate('/dashboard');
    // Mẹo: Dùng window.location.reload() nếu muốn chắc chắn 100% ứng dụng reset hoàn toàn
    window.location.reload();
  } else if (username === 'ketoan' && password === '123') {
    localStorage.setItem('userToken', 'token-ketoan');
    localStorage.setItem('userRole', 'ketoan');
    navigate('/dashboard');
    // Mẹo: Dùng window.location.reload() nếu muốn chắc chắn 100% ứng dụng reset hoàn toàn
    window.location.reload();
  } else if (username === 'user' && password === '123') {
    // Tài khoản dành cho người dân
    localStorage.setItem('userToken', 'token-user');
    localStorage.setItem('userRole', 'user'); 
    navigate('/dashboard');
    // Mẹo: Dùng window.location.reload() nếu muốn chắc chắn 100% ứng dụng reset hoàn toàn
    window.location.reload();
  } else {
    alert('Sai tài khoản hoặc mật khẩu!');
  }
};

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập Hệ Thống</h2>
        
        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="submit-button">
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default LoginPage;