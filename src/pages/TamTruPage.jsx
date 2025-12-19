// src/pages/TamTruPage.jsx
import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography, Button, Stack, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const TamTruPage = () => {
  // 1. Định nghĩa các cột cho Danh sách Tạm trú
  const columns = [
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 180 },
    { field: 'cccd', headerName: 'Số CCCD', flex: 1, minWidth: 150 },
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 0.8, align: 'center' },
    { field: 'ngayBatDau', headerName: 'Ngày bắt đầu', flex: 1, minWidth: 120 },
    { field: 'ngayKetThuc', headerName: 'Ngày kết thúc', flex: 1, minWidth: 120 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      flex: 1, 
      minWidth: 130,
      renderCell: (params) => {
        const isExpired = new Date(params.row.ngayKetThuc.split('/').reverse().join('-')) < new Date();
        return (
          <Chip 
            label={isExpired ? "Hết hạn" : "Còn hạn"} 
            color={isExpired ? "error" : "success"} 
            size="small" 
            variant="outlined"
          />
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <IconButton size="small" title="In giấy tạm trú"><PrintIcon fontSize="small" /></IconButton>
          <IconButton size="small" title="Sửa"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" title="Xóa"><DeleteIcon fontSize="small" /></IconButton>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu
  const rows = [
    { id: 1, hoTen: 'Nguyễn Văn Khoa', cccd: '038012345678', maCanHo: 'P101', ngayBatDau: '01/01/2023', ngayKetThuc: '01/01/2025' },
    { id: 2, hoTen: 'Trần Thị Đại', cccd: '038098765432', maCanHo: 'P202', ngayBatDau: '15/03/2023', ngayKetThuc: '15/03/2024' },
    { id: 3, hoTen: 'Phạm Văn Cường', cccd: '038055443322', maCanHo: 'P305', ngayBatDau: '10/10/2022', ngayKetThuc: '10/10/2023' },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Quản lý đăng ký tạm trú
      </Typography>

      <Button 
        variant="contained" 
        sx={{ mb: 3, backgroundColor: '#008ecc', textTransform: 'none', fontWeight: 'bold', width: 'fit-content' }}
      >
        ĐĂNG KÝ TẠM TRÚ MỚI
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

export default TamTruPage;