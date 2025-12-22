// src/pages/TamVangPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const TamVangPage = () => {
  const navigate = useNavigate();
  // 1. Định nghĩa các cột cho Danh sách Tạm vắng
  const columns = [
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 180 },
    { field: 'cccd', headerName: 'Số CCCD', flex: 1, minWidth: 150 },
    { field: 'maHoKhau', headerName: 'Mã hộ khẩu', flex: 0.8, align: 'center' },
    { field: 'ngayDi', headerName: 'Ngày đi', flex: 1, minWidth: 120 },
    { field: 'ngayVeDuKien', headerName: 'Ngày về dự kiến', flex: 1, minWidth: 120 },
    { field: 'lyDo', headerName: 'Lý do tạm vắng', flex: 1.5, minWidth: 200 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      flex: 1, 
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "Đang vắng" ? "warning" : "default"} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" title="Chi tiết"><InfoIcon fontSize="small" color="info" /></IconButton>
          <IconButton size="small" title="Sửa"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" title="Xóa"><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu Tạm vắng
  const rows = [
    { 
      id: 1, 
      hoTen: 'Lê Minh Triết', 
      cccd: '038099887766', 
      maHoKhau: 'HK26960674', 
      ngayDi: '10/05/2024', 
      ngayVeDuKien: '10/05/2025', 
      lyDo: 'Đi học đại học tại TP.HCM',
      trangThai: 'Đang vắng'
    },
    { 
      id: 2, 
      hoTen: 'Hoàng Văn Nam', 
      cccd: '038011223344', 
      maHoKhau: 'HK53663503', 
      ngayDi: '01/02/2024', 
      ngayVeDuKien: '01/02/2026', 
      lyDo: 'Thực hiện nghĩa vụ quân sự',
      trangThai: 'Đang vắng'
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Quản lý khai báo tạm vắng
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => navigate('/quan-ly-nhan-dan/tam-vang/create')}
        sx={{ 
          mb: 3, 
          backgroundColor: '#008ecc', 
          textTransform: 'none', 
          fontWeight: 'bold', 
          width: 'fit-content' 
        }}
      >
        KHAI BÁO TẠM VẮNG
      </Button>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 20, 50]}
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

export default TamVangPage;