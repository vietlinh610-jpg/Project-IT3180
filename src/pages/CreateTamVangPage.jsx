// src/pages/CreateTamVangPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  Stack, IconButton 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CreateTamVangPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    maTamVang: '',
    hoTen: '',
    soCCCD: '',
    noiDen: '',
    ngayDi: '2024-01-11',
    ngayVeDuKien: '2024-02-11',
    lyDo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu khai báo tạm vắng:", formData);
    alert("Khai báo tạm vắng thành công!");
    navigate('/quan-ly-nhan-dan/tam-vang');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Tiêu đề và nút quay lại */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/tam-vang')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Khai báo tạm vắng
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">

            {/* Dòng 2: Họ tên người tạm vắng */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên người khai báo *"
                name="hoTen"
                variant="filled"
                value={formData.hoTen}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 3: Số CCCD */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số CCCD/Định danh cá nhân *"
                name="soCCCD"
                variant="filled"
                value={formData.soCCCD}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 4: Mã hộ khẩu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã hộ khẩu *"
                name="maHoKhau"
                variant="filled"
                value={formData.maHoKhau}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 5: Thời gian tạm vắng */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày đi"
                name="ngayDi"
                type="date"
                variant="outlined"
                value={formData.ngayDi}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày về dự kiến"
                name="ngayVeDuKien"
                type="date"
                variant="outlined"
                value={formData.ngayVeDuKien}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Dòng 6: Lý do tạm vắng */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do tạm vắng"
                name="lyDo"
                variant="filled"
                multiline
                rows={3}
                value={formData.lyDo}
                onChange={handleChange}
                placeholder="Ví dụ: Đi công tác, Về quê, Du lịch..."
              />
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
                LƯU KHAI BÁO
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTamVangPage;