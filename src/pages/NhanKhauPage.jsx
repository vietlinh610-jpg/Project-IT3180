import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Stack, Chip, IconButton 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // Thêm icon xóa
import { useNavigate } from 'react-router-dom';

const NhanKhauPage = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // SỬA LỖI 1: Khai báo isEditing

  // SỬA LỖI 2: Chuyển membersData thành State để có thể xóa và cập nhật UI
  const [membersData, setMembersData] = useState({
    'P.805': [
      { id: 1, hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', danToc: 'Kinh', ngheNghiep: 'Kỹ sư', cccd: '001092003456', ngaySinh: '15/05/1985', quanHe: 'Chủ hộ' },
      { id: 2, hoTen: 'Trần Thị B', gioiTinh: 'Nữ', danToc: 'Kinh', ngheNghiep: 'Kế toán', cccd: '001192007890', ngaySinh: '20/08/1988', quanHe: 'Vợ' },
      { id: 3, hoTen: 'Nguyễn Văn C', gioiTinh: 'Nam', danToc: 'Kinh', ngheNghiep: 'Học sinh', cccd: 'Chưa có', ngaySinh: '10/12/2015', quanHe: 'Con' },
    ],
    'P.102': [
      { id: 4, hoTen: 'Lê Văn D', gioiTinh: 'Nam', danToc: 'Kinh', ngheNghiep: 'Tự do', cccd: '038095001234', ngaySinh: '01/01/1990', quanHe: 'Chủ hộ' },
    ]
  });

  const apartmentColumns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 120 },
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1.5, minWidth: 200 },
    { 
      field: 'soThanhVien', 
      headerName: 'Số thành viên', 
      flex: 1, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => <Chip label={params.value} color="primary" variant="outlined" size="small" />
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<GroupsIcon />}
          onClick={() => handleOpenMembers(params.row)}
          sx={{ bgcolor: '#008ecc', textTransform: 'none', fontWeight: 'bold' }}
        >
          THÀNH VIÊN
        </Button>
      ),
    },
  ];

  const apartmentRows = [
    { id: 1, maCanHo: 'P.805', tenCanHo: 'Căn hộ cao cấp 805', soThanhVien: 4 },
    { id: 2, maCanHo: 'P.102', tenCanHo: 'Căn hộ thường 102', soThanhVien: 2 },
    { id: 3, maCanHo: 'P.501', tenCanHo: 'Căn hộ Studio 501', soThanhVien: 1 },
  ];

  const handleDeleteMember = (memberId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi hộ gia đình?")) {
      const apartmentCode = selectedApartment.maCanHo;
      const updatedMembers = membersData[apartmentCode].filter(m => m.id !== memberId);
      
      setMembersData({
        ...membersData,
        [apartmentCode]: updatedMembers
      });
    }
  };

  const memberColumns = [
    { field: 'hoTen', headerName: 'Họ và tên', flex: 1, minWidth: 150 },
    { field: 'gioiTinh', headerName: 'Giới tính', width: 90 },
    { field: 'danToc', headerName: 'Dân tộc', width: 90 },
    { field: 'ngheNghiep', headerName: 'Nghề nghiệp', width: 120 },
    { field: 'cccd', headerName: 'Số CCCD', width: 140 },
    { field: 'noiSinh', headerName: 'Nơi sinh', width: 120 },
    { field: 'ngaySinh', headerName: 'Ngày sinh', width: 110 },
    { 
      field: 'quanHe', 
      headerName: 'Quan hệ với chủ hộ', 
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: params.value === 'Chủ hộ' ? 'bold' : 'normal', color: params.value === 'Chủ hộ' ? '#d32f2f' : 'inherit', fontSize: '14px' }}>
          {params.value}
        </Typography>
      )
    },
    // SỬA LỖI 3: Thêm cột xóa chỉ hiển thị khi ở chế độ Edit
    {
      field: 'delete',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params) => (
        isEditing && (
          <IconButton color="error" size="small" onClick={() => handleDeleteMember(params.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )
      )
    }
  ];

  const handleOpenMembers = (apartment) => {
    setSelectedApartment(apartment);
    setIsEditing(false); 
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Quản lý nhân khẩu
      </Typography>


      <Paper elevation={0} sx={{ flexGrow: 1, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <DataGrid
          rows={apartmentRows}
          columns={apartmentColumns}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>

      {/* SỬA LỖI 4: Cấu trúc Dialog lồng nhau */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', bgcolor: '#f8f9fa' }}>
          Danh sách thành viên - {selectedApartment?.maCanHo}
          <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={membersData[selectedApartment?.maCanHo] || []}
              columns={memberColumns}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
            />
          </Box>
        </DialogContent>
        {/* DialogActions phải nằm TRONG Dialog */}
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" color="success" onClick={() => navigate('/quan-ly-nhan-dan/nhan-khau/create')} sx={{ textTransform: 'none' }}>
            Thêm
          </Button>
          <Button 
            variant="contained" 
            color={isEditing ? "success" : "primary"} 
            onClick={() => setIsEditing(!isEditing)}
            sx={{ textTransform: 'none' }}
          >
            {isEditing ? "XONG" : "SỬA"}
          </Button>
          <Button variant="outlined" color="inherit" onClick={handleCloseModal} sx={{ textTransform: 'none' }}>
            ĐÓNG
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NhanKhauPage;