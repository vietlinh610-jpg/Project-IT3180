import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, IconButton, 
  MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ThongKeKhoanThuPage = () => {
  const navigate = useNavigate();
  
  // State quản lý năm được chọn
  const [selectedYear, setSelectedYear] = useState(2024);

  // Giả lập dữ liệu doanh thu theo từng năm
  const yearlyData = {
    2023: [
      { month: 'T1', revenue: 300 }, { month: 'T2', revenue: 250 }, { month: 'T3', revenue: 400 },
      { month: 'T4', revenue: 350 }, { month: 'T5', revenue: 420 }, { month: 'T6', revenue: 500 },
      { month: 'T7', revenue: 480 }, { month: 'T8', revenue: 510 }, { month: 'T9', revenue: 550 },
      { month: 'T10', revenue: 600 }, { month: 'T11', revenue: 580 }, { month: 'T12', revenue: 700 },
    ],
    2024: [
      { month: 'T1', revenue: 450 }, { month: 'T2', revenue: 380 }, { month: 'T3', revenue: 520 },
      { month: 'T4', revenue: 610 }, { month: 'T5', revenue: 580 }, { month: 'T6', revenue: 700 },
      { month: 'T7', revenue: 750 }, { month: 'T8', revenue: 690 }, { month: 'T9', revenue: 820 },
      { month: 'T10', revenue: 900 }, { month: 'T11', revenue: 850 }, { month: 'T12', revenue: 1100 },
    ],
    2025: [
      { month: 'T1', revenue: 600 }, { month: 'T2', revenue: 550 }, { month: 'T3', revenue: 0 },
      { month: 'T4', revenue: 0 }, { month: 'T5', revenue: 0 }, { month: 'T6', revenue: 0 },
      { month: 'T7', revenue: 0 }, { month: 'T8', revenue: 0 }, { month: 'T9', revenue: 0 },
      { month: 'T10', revenue: 0 }, { month: 'T11', revenue: 0 }, { month: 'T12', revenue: 0 },
    ]
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Thanh tiêu đề và Chọn năm */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        spacing={2} 
        sx={{ mb: 4 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate('/quan-ly-khoan-thu')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            Thống kê doanh thu
          </Typography>
        </Stack>

        {/* Dropdown chọn năm */}
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Chọn năm</InputLabel>
          <Select
            value={selectedYear}
            label="Chọn năm"
            onChange={handleYearChange}
            sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
          >
            <MenuItem value={2023}>Năm 2023</MenuItem>
            <MenuItem value={2024}>Năm 2024</MenuItem>
            <MenuItem value={2025}>Năm 2025</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: '15px' }}>
        <Typography variant="h6" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: '#34495e' }}>
          TỔNG DOANH THU THEO THÁNG - NĂM {selectedYear} (Triệu VNĐ)
        </Typography>
        
        <Box sx={{ width: '100%', height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={yearlyData[selectedYear]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#7f8c8d', fontSize: 13 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#7f8c8d', fontSize: 13 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f1f2f6' }}
                contentStyle={{ 
                  borderRadius: '10px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar 
                dataKey="revenue" 
                name="Doanh thu" 
                fill="#3498db" 
                radius={[6, 6, 0, 0]}
                barSize={35}
              >
                {yearlyData[selectedYear].map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.revenue > 800 ? '#2ecc71' : '#3498db'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default ThongKeKhoanThuPage;