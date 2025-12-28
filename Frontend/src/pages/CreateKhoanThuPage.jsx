import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack, IconButton 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CreateKhoanThuPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    tenKhoanThu: '',
    ghiChu: '',
    loaiKhoanThu: 'Phí đóng góp',
    ngayBatDau: '2024-01-11',
    ngayKetThuc: '2024-01-11'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu khoản thu mới:", formData);
    alert("Tạo khoản thu thành công!");
    navigate('/quan-ly-khoan-thu');
  };

  return (
    <Box sx={{ 
        p: 4, 
        width: '100%',        // Chiếm toàn bộ chiều rộng vùng nội dung bên phải
        height: '100vh',     // Cố định chiều cao bằng màn hình để tránh lỗi dài vô tận
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box' 
      }}>
      {/* Tiêu đề trang và nút quay lại */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-khoan-thu')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tạo khoản thu
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
           <Grid container spacing={3} direction="column">
            
            {/* Tên khoản thu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên khoản thu"
                name="tenKhoanThu"
                variant="filled"
                value={formData.tenKhoanThu}
                onChange={handleChange}
                placeholder="Nhập tên khoản thu..."
                required
              />
            </Grid>

            {/* Ghi chú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="ghiChu"
                variant="filled"
                multiline
                rows={2}
                value={formData.ghiChu}
                onChange={handleChange}
                placeholder="Nhập ghi chú..."
              />
            </Grid>

            {/* Loại khoản thu */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Loại khoản thu</InputLabel>
                <Select
                  name="loaiKhoanThu"
                  value={formData.loaiKhoanThu}
                  onChange={handleChange}
                >
                  <MenuItem value="Phí dịch vụ">Phí dịch vụ</MenuItem>
                  <MenuItem value="Phí quản lý">Phí quản lý</MenuItem>
                  <MenuItem value="Phí đóng góp">Phí đóng góp</MenuItem>
                  <MenuItem value="Phí gửi xe">Phí gửi xe</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Tên khoản thu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số tiền"
                name="soTien"
                variant="filled"
                value={formData.tenKhoanThu}
                onChange={handleChange}
                placeholder="Nhập số tiền..."
                required
              />
            </Grid>

            {/* Ngày bắt đầu và Ngày kết thúc nằm trên một hàng */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                name="ngayBatDau"
                type="date"
                variant="outlined"
                value={formData.ngayBatDau}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                name="ngayKetThuc"
                type="date"
                variant="outlined"
                value={formData.ngayKetThuc}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Nút LƯU nằm ở góc dưới bên phải */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ 
                  bgcolor: '#1abc9c', // Màu xanh ngọc giống như trong ảnh image_15b488.png
                  px: 4, 
                  py: 1.2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#16a085' }
                }}
              >
                LƯU
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateKhoanThuPage;