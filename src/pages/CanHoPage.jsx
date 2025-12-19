// src/pages/CanHoPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CanHoPage = () => {
  // 1. Định nghĩa các cột cho Danh sách căn hộ
  const columns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 100 },
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1, minWidth: 120 },
    { field: 'tang', headerName: 'Tầng', flex: 0.8, align: 'center', headerAlign: 'center' },
    { field: 'dienTich', headerName: 'Diện tích (m2)', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'maHoKhau', headerName: 'Mã hộ khẩu', flex: 1.2, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" onClick={() => console.log("Sửa căn hộ:", params.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => console.log("Xóa căn hộ:", params.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu dựa trên hình ảnh bạn cung cấp
  const rows = [
    { id: 1, maCanHo: '1', tenCanHo: 'P101', tang: 1, dienTich: 40, maHoKhau: 'HK53663503' },
    { id: 2, maCanHo: '2', tenCanHo: 'P102', tang: 1, dienTich: 50, maHoKhau: '' },
    { id: 3, maCanHo: '3', tenCanHo: 'P103', tang: 1, dienTich: 60, maHoKhau: '' },
    { id: 4, maCanHo: '4', tenCanHo: 'P201', tang: 2, dienTich: 40, maHoKhau: 'HK26960674' },
    { id: 5, maCanHo: '5', tenCanHo: 'P202', tang: 2, dienTich: 50, maHoKhau: '' },
    { id: 6, maCanHo: '6', tenCanHo: 'P301', tang: 3, dienTich: 50, maHoKhau: '' },
    { id: 7, maCanHo: '7', tenCanHo: 'P302', tang: 3, dienTich: 60, maHoKhau: '' },
  ];

  return (
    <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
      {/* Tiêu đề */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách căn hộ
      </Typography>

      {/* Nút Thêm căn hộ */}
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
        THÊM CĂN HỘ
      </Button>

      {/* Container chứa bảng lấp đầy không gian */}
      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
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

export default CanHoPage;