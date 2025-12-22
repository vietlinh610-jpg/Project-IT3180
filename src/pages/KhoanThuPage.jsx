// src/pages/KhoanThuPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const KhoanThuPage = () => {
  // 1. Định nghĩa các cột
  const columns = [
    { field: 'tenKhoanThu', headerName: 'Tên khoản thu', flex: 1.5, minWidth: 200 },
    { field: 'loaiPhi', headerName: 'Loại phí', flex: 1, minWidth: 130 },
    { 
      field: 'soTien', 
      headerName: 'Số tiền (VNĐ)', 
      flex: 1, 
      minWidth: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN').format(params.value);
      }
    },
    { field: 'hanNop', headerName: 'Hạn nộp', flex: 1, minWidth: 120 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      flex: 1, 
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "Đã hoàn thành" ? "success" : "error"} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" title="Xem chi tiết"><VisibilityIcon fontSize="small" /></IconButton>
          <IconButton size="small" title="Sửa"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" title="Xóa"><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu
  const rows = [
    { id: 1, tenKhoanThu: 'Phí dịch vụ tháng 12', loaiPhi: 'Bắt buộc', soTien: 150000, hanNop: '31/12/2023', trangThai: 'Chưa đóng' },
    { id: 2, tenKhoanThu: 'Tiền điện tháng 11', loaiPhi: 'Theo chỉ số', soTien: 850000, hanNop: '15/12/2023', trangThai: 'Đã hoàn thành' },
    { id: 3, tenKhoanThu: 'Phí gửi xe tháng 12', loaiPhi: 'Bắt buộc', soTien: 100000, hanNop: '31/12/2023', trangThai: 'Đã hoàn thành' },
    { id: 4, tenKhoanThu: 'Quỹ khuyến học 2023', loaiPhi: 'Đóng góp', soTien: 50000, hanNop: '20/12/2023', trangThai: 'Chưa đóng' },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Quản lý các khoản thu phí
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: '#008ecc', textTransform: 'none', fontWeight: 'bold' }}
        >
          TẠO KHOẢN THU MỚI
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20]}
          disableRowSelectionOnClick
          sx={{
            height: '100%', // Bảng sẽ cao bằng đúng Box cha (flexGrow: 1)
            width: '100%',  // Bảng rộng 100%
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default KhoanThuPage;