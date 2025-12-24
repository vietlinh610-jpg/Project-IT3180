// src/pages/CreateTaiKhoanPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack, IconButton, InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const CreateTaiKhoanPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    hoTen: '',
    soCCCD: '',
    tenDangNhap: '',
    matKhau: '',
    ngaySinh: '',
    vaiTro: 'user', // Mặc định là Người dùng
    trangThai: 'Hoạt động'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu tài khoản mới:", formData);
    alert("Tạo tài khoản người dùng thành công!");
    navigate('/quan-ly-tai-khoan');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Tiêu đề và nút quay lại */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-tai-khoan')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Tạo tài khoản mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">

            {/* Họ và tên chủ tài khoản */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên chủ tài khoản *"
                name="hoTen"
                variant="filled"
                value={formData.hoTen}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 2: CCCD và Dân tộc */}
                        <Grid item xs={12} md={8}>
                          <TextField
                            fullWidth
                            label="Căn cước công dân *"
                            name="soCCCD"
                            variant="filled"
                            value={formData.cccd}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
            
            {/* Tên đăng nhập */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên đăng nhập *"
                name="tenDangNhap"
                variant="filled"
                value={formData.tenDangNhap}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Mật khẩu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mật khẩu *"
                name="matKhau"
                type={showPassword ? 'text' : 'password'}
                variant="filled"
                value={formData.matKhau}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Ngày sinh */}
                        <Grid item xs={12} >
                          <TextField
                            fullWidth
                            label="Ngày sinh"
                            name="ngaySinh"
                            type="date"
                            value={formData.ngayCap}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>


            {/* Phân quyền (Vai trò) */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Vai trò hệ thống *</InputLabel>
                <Select
                  name="vaiTro"
                  value={formData.vaiTro}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="admin">Ban quản trị (Admin)</MenuItem>
                  <MenuItem value="ketoan">Kế toán</MenuItem>
                  <MenuItem value="user">Cư dân (User)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Nút lưu */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ 
                  bgcolor: '#008ecc', 
                  px: 4, 
                  py: 1.2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#007bb5' }
                }}
              >
                TẠO TÀI KHOẢN
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTaiKhoanPage;