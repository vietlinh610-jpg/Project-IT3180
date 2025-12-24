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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Chuẩn bị dữ liệu gửi đi (Mapping tên biến cho khớp Backend)
      const payload = {
        tenDangNhap: username,
        matKhau: password
      };

      // 2. Gọi API thực tế
      const res = await loginUser(payload);
      
      // 3. Lấy dữ liệu từ Backend trả về
      // Cấu trúc trả về: { message, token, user: { hoTen, quyen, ... } }
      const { token, user } = res.data;

      // 4. Xóa dữ liệu cũ và Lưu dữ liệu mới vào localStorage
      localStorage.clear();
      localStorage.setItem('userToken', token);
      let safeRole = user.quyen;
if (user.quyen === 'Admin') safeRole = 'admin';
if (user.quyen === 'Kế toán') safeRole = 'ketoan';
if (user.quyen === 'Người dùng') safeRole = 'user';
      
      // Lưu quyền (Role) để dùng cho việc phân quyền menu sau này
      // Backend trả về: 'Admin', 'Kế toán', 'Người dùng'
      localStorage.setItem('userRole', safeRole);
      
      // Lưu thêm thông tin user để hiển thị "Xin chào..."
      localStorage.setItem('userInfo', JSON.stringify(user));

      alert(`Đăng nhập thành công! Xin chào ${user.hoTen}`);

      // 5. Điều hướng
      navigate('/dashboard'); 
      
      // Reload để App cập nhật lại Menu theo quyền mới
      window.location.reload();

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      // Lấy thông báo lỗi từ Backend (ví dụ: "Sai mật khẩu")
      const msg = err.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      setError(msg);
    }
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