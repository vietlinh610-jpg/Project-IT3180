import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Stack, IconButton, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Import API lấy danh sách nhân khẩu (giả sử bạn đã có hàm này)
import { getAllNhanKhau } from '../services/nhankhauApi';

const ThongKeNhanKhauPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State lưu dữ liệu biểu đồ
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  const GENDER_COLORS = ['#3498db', '#e91e63', '#95a5a6']; // Thêm màu cho giới tính khác (nếu có)
  const AGE_COLORS = ['#1abc9c', '#f1c40f', '#e67e22'];

  // --- HÀM TÍNH TOÁN DỮ LIỆU ---
  const calculateStats = (dataList) => {
    // 1. Thống kê Giới tính
    let nam = 0;
    let nu = 0;

    // 2. Thống kê Độ tuổi
    let treEm = 0;      // < 18
    let laoDong = 0;    // 18 - 60
    let nguoiGia = 0;   // > 60

    const currentYear = dayjs().year();

    dataList.forEach(person => {
      // Đếm giới tính (Chuyển về chữ thường để so sánh cho chuẩn)
      const gioitinh = person.GioiTinh ? person.GioiTinh.toLowerCase() : '';
      if (gioitinh === 'nam') nam++;
      else if (gioitinh === 'nữ' || gioitinh === 'nu') nu++;

      // Tính tuổi và đếm nhóm tuổi
      if (person.NgaySinh) {
        const birthYear = dayjs(person.NgaySinh).year();
        const age = currentYear - birthYear;

        if (age < 18) treEm++;
        else if (age <= 60) laoDong++;
        else nguoiGia++;
      }
    });

    // Cập nhật State cho biểu đồ Giới tính
    setGenderData([
      { name: 'Nam', value: nam },
      { name: 'Nữ', value: nu },
    ]);

    // Cập nhật State cho biểu đồ Độ tuổi
    setAgeData([
      { name: 'Trẻ em (<18)', value: treEm },
      { name: 'Lao động (18-60)', value: laoDong },
      { name: 'Người cao tuổi (>60)', value: nguoiGia },
    ]);
  };

  // --- GỌI API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi API lấy toàn bộ nhân khẩu
        const response = await getAllNhanKhau();

        // Kiểm tra cấu trúc dữ liệu trả về (response.data hay response)
        const listNhanKhau = response.data || response;

        if (Array.isArray(listNhanKhau)) {
          calculateStats(listNhanKhau);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      {/* ... (Giữ nguyên phần Header cũ của bạn) ... */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <IconButton onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Thống kê cơ cấu nhân khẩu
        </Typography>
      </Stack>

      {/* Grid Container */}
      <Grid container spacing={5} justifyContent="center" sx={{ width: '100%', margin: 0 }}>

        {/* Biểu đồ giới tính */}
        <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e0e0e0', width: '100%', minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#34495e' }}>
              Tỉ lệ Giới tính
            </Typography>
            <Box sx={{
              width: '100%',
              height: 450,          // Chiều cao cố định
              minHeight: 400,       // Đảm bảo không bao giờ bị co nhỏ hơn 400px
              minWidth: 300,
              position: 'relative'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData} // <--- DÙNG DATA THẬT
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="85%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '14px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ độ tuổi */}
        <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #e0e0e0', width: '100%', minWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#34495e' }}>
              Cơ cấu Độ tuổi
            </Typography>
            <Box sx={{
              width: '100%',
              height: 450,          // Chiều cao cố định
              minHeight: 400,       // Đảm bảo không bao giờ bị co nhỏ hơn 400px
              minWidth: 300,
              position: 'relative'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData} // <--- DÙNG DATA THẬT
                    cx="50%" cy="50%"
                    outerRadius="100%"
                    dataKey="value"
                    label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                    stroke="none"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Số lượng']} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '30px', fontSize: '14px' }} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default ThongKeNhanKhauPage;