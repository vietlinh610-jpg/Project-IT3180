// src/pages/CreateTamTruPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack, IconButton 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const CreateTamTruPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    maTamTru: '',
    hoTen: '',
    soCCCD: '',
    canHo: '',
    ngayBatDau: '2024-01-11',
    ngayKetThuc: '2025-01-11',
    lyDo: '',
    ghiChu: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu đăng ký tạm trú:", formData);
    alert("Đăng ký tạm trú thành công!");
    navigate('/quan-ly-nhan-dan/tam-tru');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Tiêu đề và nút quay lại */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/tam-tru')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Đăng ký tạm trú mới
        </Typography>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            

            {/* Dòng 2: Họ tên người tạm trú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên người tạm trú *"
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
                label="Số CCCD/Hộ chiếu *"
                name="soCCCD"
                variant="filled"
                value={formData.soCCCD}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Dòng 4: Căn hộ tạm trú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Căn hộ tạm trú *"
                name="canHo"
                variant="filled"
                value={formData.canHo}
                onChange={handleChange}
                placeholder="Ví dụ: P.805"
                required
              />
            </Grid>

            {/* Dòng 5: Thời hạn tạm trú (Từ ngày - Đến ngày) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tạm trú từ ngày"
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
                label="Đến ngày"
                name="ngayKetThuc"
                type="date"
                variant="outlined"
                value={formData.ngayKetThuc}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Dòng 6: Lý do tạm trú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lý do tạm trú"
                name="lyDo"
                variant="filled"
                multiline
                rows={2}
                value={formData.lyDo}
                onChange={handleChange}
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
                LƯU ĐĂNG KÝ
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTamTruPage;