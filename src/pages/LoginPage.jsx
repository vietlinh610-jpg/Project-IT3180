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
  
  // Giả lập kiểm tra tài khoản
  if (username === 'admin' && password === '123') {
    // QUAN TRỌNG: Lưu token giả vào máy để ProtectedRoute nhận diện
    localStorage.setItem('userToken', 'fake-token-123'); 
    
    alert('Đăng nhập thành công!');
    navigate('/dashboard'); 
  } else {
    alert('Tài khoản không đúng. Vui lòng nhập lại!');
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