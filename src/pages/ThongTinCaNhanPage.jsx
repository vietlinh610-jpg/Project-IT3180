// src/pages/UserProfilePage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ThongTinCaNhanPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    hoTen: 'Đài Đạo',
    cccd: '038012345678',
    gioiTinh: 'Nam',
    ngaySinh: '1990-01-01',
    soDienThoai: '0901234567',
    queQuan: 'Hà Nội',
    danToc: 'Kinh',
    tonGiao: 'Không',
    ngheNghiep: 'Kỹ sư'
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Đã lưu thông tin mới!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2c3e50' }}>
        Thông tin cá nhân
      </Typography>

      <Paper elevation={2} sx={{ p: 5, borderRadius: '20px', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Phần Header: Tên hiện chữ nổi bật */}
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 5 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: '#008ecc', 
              fontSize: '2.5rem',
              boxShadow: '0 4px 10px rgba(0,0,142,0.3)' 
            }}
          >
            {userInfo.hoTen.charAt(0)}
          </Avatar>
          <Box>
            {/* Tên hiển thị nổi bật */}
            <Typography variant="h4" sx={{ fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
              {userInfo.hoTen}
            </Typography>
            <Typography variant="body1" sx={{ color: '#636e72', fontWeight: '500' }}>
              Cư dân Chung cư BlueMoon
            </Typography>
          </Box>
        </Stack>

        {/* Lưới thông tin chi tiết */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Họ và tên" name="hoTen" value={userInfo.hoTen} disabled={!isEditing} onChange={handleChange} variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Số CCCD" name="cccd" value={userInfo.cccd} disabled={!isEditing} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Giới tính" name="gioiTinh" value={userInfo.gioiTinh} disabled={!isEditing} onChange={handleChange} />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Ngày sinh" type="date" name="ngaySinh" value={userInfo.ngaySinh} disabled={!isEditing} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Số điện thoại" name="soDienThoai" value={userInfo.soDienThoai} disabled={!isEditing} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Quê quán" name="queQuan" value={userInfo.queQuan} disabled={!isEditing} onChange={handleChange} />
          </Grid>

          {/* Các trường mới bổ sung */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Dân tộc" name="danToc" value={userInfo.danToc} disabled={!isEditing} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Tôn giáo" name="tonGiao" value={userInfo.tonGiao} disabled={!isEditing} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Nghề nghiệp" name="ngheNghiep" value={userInfo.ngheNghiep} disabled={!isEditing} onChange={handleChange} />
          </Grid>
        </Grid>

        {/* Nút tác vụ */}
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
          {isEditing ? (
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>
                Hủy bỏ
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ bgcolor: '#2ecc71', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: '#27ae60' } }}>
                Lưu thay đổi
              </Button>
            </Stack>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<EditIcon />} 
              onClick={() => setIsEditing(true)} 
              sx={{ 
                bgcolor: '#008ecc', 
                borderRadius: '8px', 
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,142,204,0.3)',
                '&:hover': { bgcolor: '#007bb5' }
              }}
            >
              CHỈNH SỬA THÔNG TIN
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ThongTinCaNhanPage;