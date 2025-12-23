// src/pages/NhanKhauPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Chip, IconButton, CircularProgress,
  Stack 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import GroupsIcon from '@mui/icons-material/Groups';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; 
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Import API
import { getCanHoCount, getNhanKhauByCanHo, deleteNhanKhau, updateNhanKhau } from '../services/nhankhauApi';

const NhanKhauPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [apartmentRows, setApartmentRows] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [selectedMaHoKhau, setSelectedMaHoKhau] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  
  // State quản lý chế độ sửa (True = Cho phép nhập liệu)
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. LOAD DANH SÁCH CĂN HỘ ---
  const fetchApartments = async () => {
    try {
      setLoadingApartments(true);
      const res = await getCanHoCount();
      const filteredData = res.data.filter(item => item.MaHoKhau !== null);
      
      const formatted = filteredData.map((item) => ({
        id: item.MaCanHo,
        maCanHo: item.MaCanHo,
        tenCanHo: item.TenCanHo,
        soThanhVien: item.SoThanhVien,
        maHoKhau: item.MaHoKhau
      }));
      setApartmentRows(formatted);
    } catch (error) {
      console.error("Lỗi tải danh sách căn hộ:", error);
    } finally {
      setLoadingApartments(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  useEffect(() => {
   if (apartmentRows.length > 0 && location.state?.targetMaHoKhau) {
      const targetRow = apartmentRows.find(row => row.maHoKhau === location.state.targetMaHoKhau);
      if (targetRow) {
        handleOpenMembers(targetRow);
        window.history.replaceState({}, document.title);
      }
    }
  }, [apartmentRows, location.state]);

  // --- 2. XỬ LÝ MỞ MODAL ---
  const handleOpenMembers = async (apartmentRow) => {
    setSelectedApartment(apartmentRow);
    setCurrentMembers([]); 
    setOpenModal(true);
    setIsEditing(false); 
    setLoadingMembers(true);

    try {
      const res = await getNhanKhauByCanHo(apartmentRow.maCanHo);
      const rawData = (res.data && res.data.data) ? res.data.data : [];
      setSelectedMaHoKhau(res.data?.maHoKhau || null);

      const formattedMembers = rawData.map((nk, index) => ({
        id: nk.MaNhanKhau || index,
        // --- THÊM DÒNG NÀY ĐỂ HIỂN THỊ CỘT MÃ NK ---
        maNhanKhau: nk.MaNhanKhau, 
        // -------------------------------------------
        hoTen: nk.HoTen,
        gioiTinh: nk.GioiTinh,
        danToc: nk.DanToc,
        ngheNghiep: nk.NgheNghiep,
        cccd: nk.SoCCCD,
        noiSinh: nk.NoiSinh,
        ngaySinh: nk.NgaySinh ? new Date(nk.NgaySinh) : null,
        quanHe: nk.QuanHeVoiChuHo
      }));

      setCurrentMembers(formattedMembers);
    } catch (error) {
      console.error("Lỗi tải thành viên:", error);
      setCurrentMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // --- 3. XỬ LÝ LƯU KHI SỬA TRỰC TIẾP ---
  const processRowUpdate = async (newRow) => {
    try {
      const payload = {
        HoTen: newRow.hoTen,
        GioiTinh: newRow.gioiTinh,
        DanToc: newRow.danToc,
        NgheNghiep: newRow.ngheNghiep,
        SoCCCD: newRow.cccd,
        NoiSinh: newRow.noiSinh,
        QuanHeVoiChuHo: newRow.quanHe,
        NgaySinh: newRow.ngaySinh ? dayjs(newRow.ngaySinh).format('YYYY-MM-DD') : null
      };

      await updateNhanKhau(newRow.id, payload);
      return newRow;
    } catch (error) {
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  // --- 4. XỬ LÝ XÓA THÀNH VIÊN ---
  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người này?")) {
      try {
        await deleteNhanKhau(memberId);
        setCurrentMembers((prev) => prev.filter(m => m.id !== memberId));
        fetchApartments(); 
        alert("Xóa thành công!");
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // --- CẤU HÌNH CỘT THÀNH VIÊN ---
  const memberColumns = [
    // --- CỘT MÃ NHÂN KHẨU (Mới thêm) ---
    { 
      field: 'maNhanKhau', 
      headerName: 'Mã NK', 
      width: 90, 
      editable: false, // Mã NK thường không cho sửa trực tiếp để tránh lỗi hệ thống
      headerAlign: 'center',
      align: 'center'
    },
    // -----------------------------------
    { field: 'hoTen', headerName: 'Họ và tên', flex: 1.5, minWidth: 150, editable: isEditing },
    { 
      field: 'gioiTinh', headerName: 'Giới tính', width: 80, editable: isEditing,
      type: 'singleSelect', valueOptions: ['Nam', 'Nữ'] 
    },
    { field: 'quanHe', headerName: 'Quan hệ', flex: 1, editable: isEditing },
    { 
      field: 'ngaySinh', headerName: 'Ngày sinh', width: 110, editable: isEditing, type: 'date',
      valueFormatter: (value) => value ? dayjs(value).format('DD/MM/YYYY') : ''
    },
    { field: 'cccd', headerName: 'Số CCCD', width: 130, editable: isEditing },
    { field: 'danToc', headerName: 'Dân tộc', width: 90, editable: isEditing },
    { field: 'ngheNghiep', headerName: 'Nghề nghiệp', width: 120, editable: isEditing },
    // { field: 'noiSinh', headerName: 'Nơi sinh', width: 120, editable: isEditing },
    
    {
      field: 'actions', headerName: 'Xóa', width: 60, sortable: false,
      renderCell: (params) => (
        <IconButton color="error" size="small" onClick={() => handleDeleteMember(params.id)}>
           <DeleteIcon fontSize="small" />
        </IconButton>
      )
    }
  ];

  // Cột cho bảng danh sách căn hộ
  const apartmentColumns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 120 },
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1.5, minWidth: 200 },
    { 
      field: 'soThanhVien', headerName: 'Số thành viên', flex: 1, align: 'center', headerAlign: 'center',
      renderCell: (params) => <Chip label={params.value} color="primary" variant="outlined" size="small" />
    },
    {
      field: 'actions', headerName: 'Thao tác', flex: 1, minWidth: 150, sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained" size="small" startIcon={<GroupsIcon />}
          onClick={() => handleOpenMembers(params.row)}
          sx={{ bgcolor: '#008ecc', textTransform: 'none', fontWeight: 'bold' }}
        >
          THÀNH VIÊN
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Quản lý nhân khẩu 
      </Typography>

      <Paper elevation={0} sx={{ flexGrow: 1, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <DataGrid
          rows={apartmentRows}
          columns={apartmentColumns}
          loading={loadingApartments}
          slots={{ toolbar: GridToolbar }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Paper>

      {/* --- MODAL CHI TIẾT --- */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', bgcolor: '#f8f9fa' }}>
          Thành viên - {selectedApartment?.tenCanHo}
          <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={currentMembers}
              columns={memberColumns} 
              loading={loadingMembers}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(err) => console.log(err)}
              onCellClick={(params, event) => {
                if (isEditing && params.colDef.editable) {
                  event.defaultMuiPrevented = true; 
                  params.api.startCellEditMode({ id: params.id, field: params.field });
                }
              }}
              slots={{
                noRowsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                        {loadingMembers ? "Đang tải..." : "Chưa có thành viên nào"}
                    </Stack>
                )
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          {selectedMaHoKhau && (
             <Button 
                variant="outlined" color="success" startIcon={<AddIcon />}
                onClick={() => navigate(`/quan-ly-nhan-dan/nhan-khau/create/${selectedMaHoKhau}`)}
                sx={{ textTransform: 'none' }}
             >
                Thêm thành viên
             </Button>
          )}

          <Button 
            variant="contained" 
            color={isEditing ? "primary" : "warning"} 
            startIcon={isEditing ? <GroupsIcon /> : <EditIcon />}
            onClick={() => setIsEditing(!isEditing)}
            disabled={currentMembers.length === 0} 
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            {isEditing ? "HOÀN TẤT" : "CHỈNH SỬA"}
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