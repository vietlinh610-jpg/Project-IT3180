import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Box, Typography, Button, Stack, IconButton, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt'; // Icon cho Danh sách hộ
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const KhoanThuPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // 1. Định nghĩa cột cho bảng Khoản thu chính
  const columns = [
    { field: 'tenKhoanThu', headerName: 'Tên khoản thu', flex: 1.5, minWidth: 200 },
    { field: 'loaiKhoanThu', headerName: 'Loại khoản thu', flex: 1, minWidth: 150 },
    { field: 'soTien', headerName: 'Số tiền', width: 130 },
    { field: 'ngayBatDau', headerName: 'Ngày bắt đầu', flex: 1, minWidth: 120 },
    { field: 'ngayKetThuc', headerName: 'Ngày kết thúc', flex: 1, minWidth: 120 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "Đã nộp" ? "success" : "error"} 
          size="small" 
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 2,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ListAltIcon />}
            onClick={() => handleOpenHouseholdList(params.row)}
            sx={{ bgcolor: '#008ecc', textTransform: 'none', fontSize: '12px' }}
          >
            DANH SÁCH HỘ
          </Button>
        </Stack>
      ),
    },
  ];

  // 2. Dữ liệu mẫu danh mục khoản thu
  const rows = [
    { id: 1, tenKhoanThu: 'Phí dịch vụ', loaiKhoanThu: 'Phí dịch vụ', ngayBatDau: '01/01/2024', ngayKetThuc: '31/01/2024' },
    { id: 2, tenKhoanThu: 'Phí quản lý', loaiKhoanThu: 'Phí quản lý', ngayBatDau: '01/01/2024', ngayKetThuc: '31/01/2024' },
    { id: 3, tenKhoanThu: 'Phí đóng góp', loaiKhoanThu: 'Phí đóng góp', ngayBatDau: '01/01/2024', ngayKetThuc: '31/01/2024' },
    { id: 4, tenKhoanThu: 'Phí gửi xe', loaiKhoanThu: 'Phí gửi xe', ngayBatDau: '01/01/2024', ngayKetThuc: '31/01/2024' },
    { id: 5, tenKhoanThu: 'Phí sinh hoạt', loaiKhoanThu: 'Phí sinh hoạt', ngayBatDau: '01/01/2024', ngayKetThuc: '31/01/2024' },
  ];

  // 3. Cấu trúc cột cho bảng chi tiết hộ gia đình trong Modal
  const householdColumns = [
    { field: 'canHo', headerName: 'Căn hộ', width: 100 },
    { field: 'chuHo', headerName: 'Chủ hộ', flex: 1 },
    { field: 'soTien', headerName: 'Số tiền', width: 130 },
    { field: 'ngayNop', headerName: 'Ngày nộp', width: 130 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === "Đã nộp" ? "success" : "error"} 
          size="small" 
        />
      )
    },
  ];

  // Dữ liệu mẫu trạng thái nộp tiền các hộ
  const householdRows = [
    { id: 1, canHo: 'P.101', chuHo: 'Nguyễn Văn A', soTien: '500.000', ngayNop: '05/01/2024', trangThai: 'Đã nộp' },
    { id: 2, canHo: 'P.102', chuHo: 'Trần Thị B', soTien: '500.000', ngayNop: '-', trangThai: 'Chưa nộp' },
    { id: 3, canHo: 'P.205', chuHo: 'Lê Văn C', soTien: '500.000', ngayNop: '10/01/2024', trangThai: 'Đã nộp' },
  ];

  const handleOpenHouseholdList = (fee) => {
    setSelectedFee(fee);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Quản lý các khoản thu phí
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
            variant="contained" 
            onClick={() => navigate('/quan-ly-khoan-thu/create')} // Sửa lại đường dẫn chuyển hướng
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
            height: '100%',
            width: '100%',
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa' }
          }}
        />
      </Box>

      {/* MODAL HIỂN THỊ DANH SÁCH HỘ */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Tình trạng nộp: {selectedFee?.tenKhoanThu}
          <IconButton onClick={() => setOpenModal(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={householdRows}
              columns={householdColumns}
              pageSizeOptions={[5]}
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
              disableRowSelectionOnClick
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} variant="outlined">Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KhoanThuPage;