// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginApi'; // Import API
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State để hiện lỗi nếu có
  const navigate = useNavigate();

  const DEFAULT_ACCOUNT = {
  username: 'admin',
  password: '123456',
  user: {
    hoTen: 'Quản trị hệ thống',
    quyen: 'Admin'
  },
  token: 'FAKE_TOKEN_123'
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // KIỂM TRA TÀI KHOẢN MẶC ĐỊNH TRƯỚC
    if (username === DEFAULT_ACCOUNT.username && password === DEFAULT_ACCOUNT.password) {
      const { token, user } = DEFAULT_ACCOUNT;
      handleSuccessLogin(token, user); // Tách hàm để dùng chung
      return;
    }

    // NẾU KHÔNG PHẢI ADMIN MẶC ĐỊNH -> GỌI API THẬT
    try {
      const payload = { tenDangNhap: username, matKhau: password };
      const res = await loginUser(payload);
      const { token, user } = res.data;
      handleSuccessLogin(token, user);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      const msg = err.response?.data?.message || "Đăng nhập thất bại!";
      setError(msg);
    }
  };

  // Hàm bổ trợ để tránh lặp code (DRY - Don't Repeat Yourself)
  const handleSuccessLogin = (token, user) => {
    localStorage.clear();
    localStorage.setItem('userToken', token);
    
    // Logic map quyền của bạn
    const roleMap = { 'Admin': 'admin', 'Kế toán': 'ketoan', 'Người dùng': 'user' };
    const safeRole = roleMap[user.quyen] || 'user';

    localStorage.setItem('userRole', safeRole);
    localStorage.setItem('userInfo', JSON.stringify(user));

    alert(`Đăng nhập thành công! Xin chào ${user.hoTen}`);
    navigate('/dashboard');
    window.location.reload(); 
  };
  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng Nhập Hệ Thống</h2>
        
        {/* Hiển thị lỗi nếu có */}
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Nhập tên đăng nhập"
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
            placeholder="Nhập mật khẩu"
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