// src/pages/CreateCanHoPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, Stack 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const CreateCanHoPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    maCanHo: '',
    tenCanHo: '',
    tang: '',
    dienTich: '',
    loaiCanHo: 'Chung cư',
    trangThai: 'Trống'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu căn hộ mới:", formData);
    alert("Thêm căn hộ thành công!");
    navigate('/ho-gia-dinh/can-ho');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Thêm căn hộ mới
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0', maxWidth: '1000px' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            
            {/* DÒNG 1: Mã căn hộ */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã căn hộ *"
                name="maCanHo"
                variant="filled"
                value={formData.maCanHo}
                onChange={handleChange}
                placeholder="Ví dụ: CH101"
                required
              />
            </Grid>

            {/* DÒNG 2: Tên căn hộ */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên căn hộ *"
                name="tenCanHo"
                variant="filled"
                value={formData.tenCanHo}
                onChange={handleChange}
                placeholder="Nhập tên căn hộ..."
                required
              />
            </Grid>

            {/* DÒNG 3: Tầng */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tầng *"
                name="tang"
                type="number"
                variant="filled"
                value={formData.tang}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* DÒNG 4: Diện tích */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diện tích (m2) *"
                name="dienTich"
                type="number"
                variant="filled"
                value={formData.dienTich}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* DÒNG 5: Trạng thái căn hộ */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={handleChange}
                >
                  <MenuItem value="Trống">Trống</MenuItem>
                  <MenuItem value="Đã bàn giao">Đã bàn giao</MenuItem>
                  <MenuItem value="Đang ở">Đang ở</MenuItem>
                  <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* NÚT LƯU */}
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
                LƯU CĂN HỘ
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateCanHoPage;