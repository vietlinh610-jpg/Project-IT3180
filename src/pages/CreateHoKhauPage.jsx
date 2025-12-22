// src/pages/CreateHoKhauPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, 
  MenuItem, Select, FormControl, InputLabel, OutlinedInput, Chip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const CreateHoKhauPage = () => {
  const navigate = useNavigate();
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    maHoKhau: '',
    diaChiThuongTru: '',
    noiCap: '',
    ngayCap: '2024-01-11',
    danhSachNhanKhau: []
  });

  // Giả lập danh sách nhân khẩu chưa có hộ khẩu để chọn
  const nhanKhauAvailable = [
    { id: 'NK001', hoTen: 'Nguyễn Hùng An' },
    { id: 'NK002', hoTen: 'Thu Trang' },
    { id: 'NK003', hoTen: 'Trần Đạt' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Tại đây bạn sẽ gọi API để lưu dữ liệu vào database
    console.log("Dữ liệu đăng ký:", formData);
    
    alert("Đăng ký hộ khẩu thành công!");
    navigate('/ho-gia-dinh/ho-khau'); // Quay lại trang danh sách sau khi lưu
  };

  return (
    <Box sx={{ p: 4, 
        width: '100%',        // Chiếm toàn bộ chiều rộng vùng nội dung bên phải
        height: '100vh',     // Cố định chiều cao bằng màn hình để tránh lỗi dài vô tận
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'  
      }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Đăng ký hộ khẩu
      </Typography>

      <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3} direction="column">
            {/* Mã hộ khẩu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mã hộ khẩu"
                name="maHoKhau"
                variant="filled"
                value={formData.maHoKhau}
                onChange={handleChange}
                placeholder="Nhập mã hộ khẩu..."
                required
              />
            </Grid>

            {/* Địa chỉ thường trú */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ thường trú"
                name="diaChiThuongTru"
                variant="filled"
                value={formData.diaChiThuongTru}
                onChange={handleChange}
                placeholder="Nhập địa chỉ..."
                required
              />
            </Grid>

            {/* Nơi cấp */}
            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Nơi cấp"
                name="noiCap"
                variant="filled"
                value={formData.noiCap}
                onChange={handleChange}
                placeholder="Cơ quan cấp..."
              />
            </Grid>

            {/* Ngày cấp */}
            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Ngày cấp"
                name="ngayCap"
                type="date"
                value={formData.ngayCap}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Danh sách mã nhân khẩu (Multi-select) */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Danh sách mã nhân khẩu</InputLabel>
                <Select
                  multiple
                  name="danhSachNhanKhau"
                  value={formData.danhSachNhanKhau}
                  onChange={handleChange}
                  input={<OutlinedInput label="Danh sách mã nhân khẩu" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" color="primary" />
                      ))}
                    </Box>
                  )}
                >
                  {nhanKhauAvailable.map((nk) => (
                    <MenuItem key={nk.id} value={nk.id}>
                      {nk.id} - {nk.hoTen}
                    </MenuItem>
                  ))}
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
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none'
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

export default CreateHoKhauPage;