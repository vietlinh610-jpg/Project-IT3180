import React from 'react';
import { Box, Typography, Paper, Grid, Stack, IconButton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ThongKeNhanKhauPage = () => {
  const navigate = useNavigate();

  const genderData = [
    { name: 'Nam', value: 450 },
    { name: 'Nữ', value: 550 },
  ];
  const GENDER_COLORS = ['#3498db', '#e91e63'];

  const ageData = [
    { name: 'Trẻ em (<18 tuổi)', value: 200 },
    { name: 'Người đi làm (18-60)', value: 650 },
    { name: 'Người già (>60 tuổi)', value: 150 },
  ];
  const AGE_COLORS = ['#1abc9c', '#f1c40f', '#e67e22'];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      {/* Header - Đảm bảo thanh tiêu đề dàn trải đều */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <IconButton onClick={() => navigate('/ho-gia-dinh/ho-khau')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Thống kê cơ cấu nhân khẩu
        </Typography>
      </Stack>

      {/* Grid Container - Sử dụng spacing lớn và căn giữa toàn bộ container */}
      <Grid container spacing={5} justifyContent="center" sx={{ width: '100%', margin: 0 }}>
        
        {/* Biểu đồ giới tính - Tăng kích thước Grid item lên 6 cột (nửa màn hình) */}
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: '24px', 
              border: '1px solid #e0e0e0', 
              width: '100%', 
              minWidth: '400px', // Khống chế chiều rộng tối đa để không bị quá to
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
              
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#34495e' }}>
              Tỉ lệ Giới tính
            </Typography>
            
            {/* Box chứa biểu đồ với tỉ lệ vuông 1:1 và chiếm dụng không gian lớn */}
            <Box sx={{ width: '100%', aspectRatio: '1/1', maxHeight: '450px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%" 
                    outerRadius="85%"
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '30px', fontSize: '14px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ độ tuổi */}
        <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              borderRadius: '24px', 
              border: '1px solid #e0e0e0', 
              width: '100%', 
              minWidth: '400px',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#34495e' }}>
              Cơ cấu Độ tuổi
            </Typography>
            
            <Box sx={{ width: '100%', aspectRatio: '1/1', maxHeight: '450px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageData}
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={AGE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '30px', fontSize: '14px' }} 
                  />
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