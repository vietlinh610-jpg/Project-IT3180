// src/pages/BillingPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Button, Stack, Modal
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const KhoanThuUserPage = () => {
  const [open, setOpen] = useState(false); // Trạng thái mở Modal QR

  // Dữ liệu mẫu các khoản thu của cư dân
  const bills = [
    { id: 1, ten: "Phí quản lý tháng 12", loai: "Bắt buộc", soTien: "500,000", hanNop: "31/12/2023", trangThai: "Chưa nộp" },
    { id: 2, ten: "Tiền điện tháng 11", loai: "Biến đổi", soTien: "1,250,000", hanNop: "15/12/2023", trangThai: "Đã nộp" },
    { id: 3, ten: "Tiền nước tháng 11", loai: "Biến đổi", soTien: "180,000", hanNop: "15/12/2023", trangThai: "Đã nộp" },
    { id: 4, ten: "Phí gửi xe máy", loai: "Bắt buộc", soTien: "100,000", hanNop: "31/12/2023", trangThai: "Chưa nộp" },
    { id: 5, ten: "Quỹ cư dân 2023", loai: "Tự nguyện", soTien: "200,000", hanNop: "31/12/2023", trangThai: "Chưa nộp" },
  ];

  // Hàm định dạng màu sắc cho trạng thái
  const getStatusChip = (status) => {
    if (status === "Đã nộp") return <Chip label={status} color="success" size="small" />;
    return <Chip label={status} color="error" size="small" variant="outlined" />;
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Danh sách khoản thu
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PaymentIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#308ed6ff', '&:hover': { bgcolor: '#b2bec3' } }}
        >
          Thanh toán nhanh QR
        </Button>
      </Stack>

      <Paper elevation={1} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptLongIcon color="primary" />
          <Typography sx={{ fontWeight: 'bold' }}>Chi tiết hóa đơn căn hộ P.805</Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên khoản thu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Loại phí</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Số tiền (VNĐ)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hạn nộp</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{bill.ten}</TableCell>
                  <TableCell>{bill.loai}</TableCell>
                  <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{bill.soTien}</TableCell>
                  <TableCell>{bill.hanNop}</TableCell>
                  <TableCell>{getStatusChip(bill.trangThai)}</TableCell>
                  <TableCell>
                    {bill.trangThai === "Chưa nộp" ? (
                      <Button size="small" variant="text" onClick={() => setOpen(true)}>Chi tiết</Button>
                    ) : (
                      <Typography variant="caption" color="text.disabled">N/A</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal hiện mã QR giả lập */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 350, bgcolor: 'background.paper', borderRadius: '15px', p: 4, textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quét mã VietQR</Typography>
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThanhToanPhiChungCu" 
            alt="QR Code" 
            style={{ width: '100%', maxWidth: '200px' }}
          />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Nội dung: <strong>THANH TOAN P805</strong>
          </Typography>
          <Button fullWidth variant="outlined" sx={{ mt: 3 }} onClick={() => setOpen(false)}>Đóng</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default KhoanThuUserPage;