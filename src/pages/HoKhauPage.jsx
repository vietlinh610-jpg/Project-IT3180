// src/pages/HoKhauPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton } from '@mui/material';
// Import các Icon cần thiết
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const HoKhauPage = () => {
  // 1. Định nghĩa các cột của bảng
  const columns = [
    { field: 'maHoKhau', headerName: 'Mã hộ khẩu', flex: 1, minWidth: 150 },
    { field: 'soThanhVien', headerName: 'Số thành viên', flex: 0.8, align: 'center', headerAlign: 'center' },
    { field: 'diaChi', headerName: 'Địa chỉ thường trú', flex: 1.5, minWidth: 200 },
    { field: 'noiCap', headerName: 'Nơi cấp', flex: 1, minWidth: 120 },
    { field: 'ngayCap', headerName: 'Ngày cấp', flex: 1, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton 
            size="small" 
            onClick={() => console.log("Sửa:", params.id)}
            title="Chỉnh sửa"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => console.log("Xóa:", params.id)}
            title="Xóa"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AccountBalanceWalletIcon />}
            sx={{ 
                backgroundColor: '#008ecc', 
                textTransform: 'none', 
                fontSize: '0.75rem',
                '&:hover': { backgroundColor: '#0076a8' }
            }}
          >
            KHOẢN THU
          </Button>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu (Rows)
  const rows = [
    { id: 1, maHoKhau: 'HK26960674', soThanhVien: 3, diaChi: 'Chung cư BlueMoon', noiCap: 'Thanh Hóa', ngayCap: '27/12/2005' },
    { id: 2, maHoKhau: 'HK53663503', soThanhVien: 2, diaChi: 'Chung cư BlueMoon', noiCap: 'Phú Thọ', ngayCap: '21/04/2009' },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%',        // Chiếm toàn bộ chiều rộng vùng nội dung bên phải
      height: '100vh',     // Cố định chiều cao bằng màn hình để tránh lỗi dài vô tận
      display: 'flex', 
      flexDirection: 'column',
      boxSizing: 'border-box' // Đảm bảo padding không làm tràn màn hình
    }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách hộ khẩu
      </Typography>

      <Button variant="contained" sx={{ mb: 3, width: 'fit-content', backgroundColor: '#008ecc' }}>
        ĐĂNG KÝ HỘ KHẨU
      </Button>

      {/* Container chứa bảng - Điểm mấu chốt để bảng rộng 100% và không dài vô tận */}
      <Box sx={{ 
        width: '100%',     // Rộng bằng màn hình
        flexGrow: 1,       // Tự động lấp đầy chiều cao còn lại của màn hình
        minHeight: 0,      // Quan trọng: Cho phép container co giãn đúng trong Flexbox
        backgroundColor: '#fff' 
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          // BỎ autoHeight - Đây là nguyên nhân khiến bảng dài không dừng
          // autoHeight 
          
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
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

export default HoKhauPage;