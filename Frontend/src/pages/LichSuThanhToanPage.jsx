// src/pages/BillingHistoryPage.jsx
import React from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';

const LichSuThanhToanPage = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu lịch sử (Các khoản đã hoàn thành cách đây 2 tháng)
  const historyData = [
    { id: 101, ten: "Tiền điện tháng 10", loai: "Biến đổi", soTien: "1,100,000", ngayNop: "12/10/2023", trangThai: "Đã nộp" },
    { id: 102, ten: "Tiền nước tháng 10", loai: "Biến đổi", soTien: "150,000", ngayNop: "12/10/2023", trangThai: "Đã nộp" },
    { id: 103, ten: "Phí quản lý tháng 10", loai: "Bắt buộc", soTien: "500,000", ngayNop: "05/10/2023", trangThai: "Đã nộp" },
    { id: 104, ten: "Tiền điện tháng 09", loai: "Biến đổi", soTien: "950,000", ngayNop: "10/09/2023", trangThai: "Đã nộp" },
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/khoan-thu')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Lịch sử thanh toán
        </Typography>
      </Stack>

      <Paper elevation={1} sx={{ borderRadius: '15px', overflow: 'hidden' }}>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên khoản thu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loại phí</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số tiền (VNĐ)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày nộp</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.ten}</TableCell>
                  <TableCell>{item.loai}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{item.soTien}</TableCell>
                  <TableCell>{item.ngayNop}</TableCell>
                  <TableCell>
                    <Chip label={item.trangThai} color="success" size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default LichSuThanhToanPage;