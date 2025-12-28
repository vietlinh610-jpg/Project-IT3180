// src/pages/CreateHoKhauPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper,
  Stack, IconButton, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { createHoKhau } from '../services/hokhauApi'; // Import API

const CreateHoKhauPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State quản lý loading
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    maHoKhau: '',
    diaChiThuongTru: '',
    noiCap: '',
    ngayCap: '', // Để rỗng để người dùng tự chọn
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Validate cơ bản
    if (!formData.maHoKhau) {
      alert("Vui lòng nhập Mã hộ khẩu!");
      return;
    }

    try {
      setLoading(true); // Bật loading

      // 2. Chuẩn bị dữ liệu gửi lên Backend (Mapping sang PascalCase)
      const payload = {
        MaHoKhau: formData.maHoKhau.trim(),
        DiaChiThuongTru: formData.diaChiThuongTru,
        NoiCap: formData.noiCap,
        NgayCap: formData.ngayCap || null // Nếu không chọn ngày thì gửi null
      };

      // 3. Gọi API
      await createHoKhau(payload);
      
      alert("Đăng ký hộ khẩu thành công!");
      navigate('/ho-gia-dinh/ho-khau'); // Quay lại trang danh sách

    } catch (error) {
      console.error("Lỗi thêm mới:", error);
      // Hiển thị thông báo lỗi từ Backend (VD: Trùng mã hộ khẩu)
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      alert(message);
    } finally {
      setLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <Box sx={{ 
        p: 4, 
        width: '100%',        
        height: '100vh',     
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'  
      }}>
      
      {/* Tiêu đề và nút quay lại */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/ho-gia-dinh/ho-khau')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Đăng ký hộ khẩu
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            
            {/* Mã hộ khẩu */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Mã hộ khẩu (VD: HK001) *"
                name="maHoKhau"
                variant="filled"
                value={formData.maHoKhau}
                onChange={handleChange}
                placeholder="Nhập mã hộ khẩu..."
                required
                autoFocus // Tự động focus vào ô này
              />
            </Grid>

            {/* Địa chỉ thường trú */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Địa chỉ thường trú "
                name="diaChiThuongTru"
                variant="filled"
                value={formData.diaChiThuongTru}
                onChange={handleChange}
                placeholder="Số nhà, đường, phường, quận..."
                multiline
                rows={2} // Cho phép nhập nhiều dòng địa chỉ
              />
            </Grid>

            {/* Nơi cấp */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nơi cấp"
                name="noiCap"
                variant="filled"
                value={formData.noiCap}
                onChange={handleChange}
                placeholder="Ví dụ: Công an TP Hà Nội"
              />
            </Grid>

            {/* Ngày cấp */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Ngày cấp"
                name="ngayCap"
                type="date"
                variant="filled"
                value={formData.ngayCap}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Nút lưu */}
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={loading} // Khóa nút khi đang load
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  bgcolor: '#008ecc', 
                  px: 4, 
                  py: 1.2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#007bb5' }
                }}
              >
                {loading ? "ĐANG LƯU..." : "LƯU HỘ KHẨU"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateHoKhauPage;