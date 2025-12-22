// src/pages/CreateNhanKhauPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, IconButton, Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CreateNhanKhauPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hoTen: '',
    cccd: '',
    danToc: '',
    ngheNghiep: '',
    ngaySinh: '2024-01-11',
    noiSinh: '',
    trangThai: 'Còn sống',
    quanHe: '',
    ghiChu: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu nhân khẩu mới:", formData);
    alert("Đăng ký nhân khẩu thành công!");
    navigate('/quan-ly-nhan-dan/nhan-khau');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Nút quay lại và Tiêu đề */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Đăng ký nhân khẩu mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            
            {/* Dòng 1: Họ tên */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ tên *"
                name="hoTen"
                variant="filled"
                value={formData.hoTen}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng : Giới tính*/}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Giới tính *"
                name="gioiTinh"
                variant="filled"
                value={formData.gioiTinh}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 2: CCCD và Dân tộc */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Căn cước công dân *"
                name="cccd"
                variant="filled"
                value={formData.cccd}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Dân tộc"
                name="danToc"
                variant="filled"
                value={formData.danToc}
                onChange={handleChange}
              />
            </Grid>

            {/* Dòng 3: Nghề nghiệp và Ngày sinh */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Nghề nghiệp"
                name="ngheNghiep"
                variant="filled"
                value={formData.ngheNghiep}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ngày sinh"
                name="ngaySinh"
                type="date"
                variant="filled"
                value={formData.ngaySinh}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Dòng 4: Nơi sinh */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nơi sinh"
                name="noiSinh"
                variant="filled"
                value={formData.noiSinh}
                onChange={handleChange}
              />
            </Grid>

            {/* Dòng 5: Trạng thái và Quan hệ */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Quan hệ với chủ hộ"
                name="quanHe"
                variant="filled"
                value={formData.quanHe}
                onChange={handleChange}
              />
            </Grid>

            {/* Dòng 6: Ghi chú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="ghiChu"
                variant="filled"
                multiline
                rows={3}
                value={formData.ghiChu}
                onChange={handleChange}
              />
            </Grid>

            {/* Nút thao tác */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau')}
                sx={{ textTransform: 'none' }}
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ 
                  bgcolor: '#27ae60', 
                  px: 4, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#219150' }
                }}
              >
                LƯU NHÂN KHẨU
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateNhanKhauPage;