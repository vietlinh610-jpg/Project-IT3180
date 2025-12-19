// src/pages/TaiKhoanPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaiKhoanPage = () => {
  // 1. Định nghĩa các cột cho Danh sách nhân khẩu
  const columns = [
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 180 },
    { field: 'cccd', headerName: 'Số CCCD', flex: 1, minWidth: 150 },
    { field: 'tenDangNhap', headerName: 'Tên đăng nhập', flex: 1.2, minWidth: 180 },
    { field: 'matKhau', headerName: 'Mật khẩu', flex: 1, minWidth: 120 },
    { field: 'ngaySinh', headerName: 'Ngày sinh', flex: 1, minWidth: 130 },
    { 
      field: 'quyenTaiKhoan', 
      headerName: 'Quyền tài khoản', 
      flex: 1, 
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined" 
          color={params.value === 'Kế toán' ? 'primary' : 'default'} 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" onClick={() => console.log("Tạo quyền:", params.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => console.log("Xóa quyền:", params.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu (Rows)
  const rows = [
    { id: 1, hoTen: 'Nguyễn Văn Đại', cccd: '038012345678', tenDangNhap: 'admin1', matKhau: '456', ngaySinh: '01/01/1985', quyenTaiKhoan: 'Kế toán' },
    { id: 2, hoTen: 'Trần Thị Linh', cccd: '038098765432', tenDangNhap: 'nguoidung1', matKhau: '789', ngaySinh: '01/01/1990', quyenTaiKhoan: 'Người dùng' },
    { id: 3, hoTen: 'Lê Công Dũng', cccd: '038055667788',tenDangNhap: 'nguoidung2', matKhau: '156', ngaySinh: '01/01/2000', quyenTaiKhoan: 'Người dùng' },
  ];

  return (
    <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100%',
        boxSizing: 'border-box' // Đảm bảo padding không làm tràn màn hình
    }}>
      {/* Tiêu đề */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách tài khoản
      </Typography>

      {/* Nút Thêm nhân khẩu */}
      <Button 
        variant="contained" 
        sx={{ 
          mb: 3, 
          backgroundColor: '#008ecc', 
          textTransform: 'none', 
          fontWeight: 'bold',
          width: 'fit-content'
        }}
      >
        THÊM TÀI KHOẢN
      </Button>

      {/* Container bảng */}
      <Box sx={{ 
        flexGrow: 1, 
        width: '100%', 
        backgroundColor: '#fff',
         minHeight: 0 
        }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
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

export default TaiKhoanPage;