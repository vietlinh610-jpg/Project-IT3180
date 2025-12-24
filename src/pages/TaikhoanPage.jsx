// src/pages/TaiKhoanPage.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Box, Typography, Button, Stack, IconButton, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const TaiKhoanPage = () => {
  const navigate = useNavigate();
  
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. STATE QUẢN LÝ MODAL SỬA ---
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: '', 
    hoTen: '', 
    cccd: '', 
    tenDangNhap: '', 
    matKhau: '', 
    quyenTaiKhoan: ''
  });

  // --- 3. GỌI API LẤY DANH SÁCH ---
  const fetchTaiKhoan = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/tai-khoan'); 
      const data = await response.json();
      
      // Format dữ liệu trước khi đưa vào bảng
      const formattedData = data.map(item => ({
        ...item,
        // Format ngày sinh (nếu null thì hiện ---)
        ngaySinh: item.ngaySinh ? new Date(item.ngaySinh).toLocaleDateString('en-GB') : '---',
        // Format Mã hộ khẩu (Admin không có mã HK thì hiện ---)
        maHoKhau: item.maHoKhau || '---' 
      }));

      setRows(formattedData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaiKhoan();
  }, []);

  // --- 4. XỬ LÝ XÓA TÀI KHOẢN ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await fetch(`http://localhost:3000/api/tai-khoan/${id}`, { method: 'DELETE' });
        fetchTaiKhoan(); // Load lại bảng sau khi xóa
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  // --- 5. XỬ LÝ SỬA TÀI KHOẢN ---
  
  // Hàm mở Modal và đổ dữ liệu dòng đó vào form
  const handleEditClick = (row) => {
    setEditData({
      id: row.id,
      hoTen: row.hoTen,
      cccd: row.cccd,
      tenDangNhap: row.tenDangNhap,
      matKhau: row.matKhau, // Lưu ý: thực tế matKhau thường được hash, ở đây hiển thị demo
      quyenTaiKhoan: row.quyenTaiKhoan
    });
    setOpenEdit(true);
  };

  // Hàm gọi API Lưu thay đổi
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/tai-khoan/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenDangNhap: editData.tenDangNhap,
          matKhau: editData.matKhau,
          hoTen: editData.hoTen,
          cccd: editData.cccd,
          quyen: editData.quyenTaiKhoan // Gửi quyền lên để Backend biết đường check logic
        })
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        setOpenEdit(false);
        fetchTaiKhoan(); // Load lại dữ liệu mới nhất
      } else {
        const err = await response.json();
        alert("Lỗi: " + err.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Đã xảy ra lỗi kết nối server");
    }
  };

  // --- 6. CẤU HÌNH CỘT CHO DATAGRID ---
  const columns = [
    { 
      field: 'maHoKhau', 
      headerName: 'Mã HK', 
      flex: 0.8, 
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 'bold', color: params.value === '---' ? '#999' : '#000' }}>
            {params.value}
        </Typography>
      )
    },
    { field: 'hoTen', headerName: 'Họ tên', flex: 1.2, minWidth: 180 },
    { field: 'cccd', headerName: 'Số CCCD', flex: 1, minWidth: 150 },
    { field: 'tenDangNhap', headerName: 'Tên đăng nhập', flex: 1, minWidth: 150 },
    { field: 'matKhau', headerName: 'Mật khẩu', flex: 0.8, minWidth: 100 }, 
    { field: 'ngaySinh', headerName: 'Ngày sinh', flex: 1, minWidth: 120 },
    { 
      field: 'quyenTaiKhoan', 
      headerName: 'Quyền tài khoản', 
      flex: 1, 
      minWidth: 140,
      renderCell: (params) => {
        let color = 'default';
        if (params.value === 'Admin') color = 'error';       
        if (params.value === 'Kế toán') color = 'primary';   
        if (params.value === 'Người dùng') color = 'success'; 
        
        return (
          <Chip label={params.value} size="small" variant="outlined" color={color} />
        );
      }
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
          <IconButton size="small" onClick={() => handleEditClick(params.row)}>
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.id)}>
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách tài khoản
      </Typography>

      {/* Nút chuyển trang sang Thêm mới */}
      <Button 
        variant="contained" 
        onClick={() => navigate('/quan-ly-tai-khoan/create')}
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

      {/* Bảng dữ liệu */}
      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff', minHeight: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            height: '100%',
            width: '100%',
            border: '1px solid #e0e0e0',
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f8f9fa' }
          }}
        />
      </Box>

      {/* --- DIALOG (MODAL) SỬA TÀI KHOẢN --- */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          Cập nhật tài khoản
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ paddingTop: 1 }}>
            
            {/* 1. Tên đăng nhập (Cho phép sửa) */}
            <TextField 
              label="Tên đăng nhập" 
              fullWidth 
              value={editData.tenDangNhap}
              onChange={(e) => setEditData({...editData, tenDangNhap: e.target.value})}
            />

            {/* 2. Mật khẩu (Cho phép sửa) */}
            <TextField 
              label="Mật khẩu" 
              fullWidth 
              value={editData.matKhau}
              onChange={(e) => setEditData({...editData, matKhau: e.target.value})}
            />

            {/* 3. Họ tên (Khóa nếu là User, Mở nếu là Admin) */}
            <TextField 
              label="Họ và tên" 
              fullWidth 
              value={editData.hoTen}
              // Logic khóa:
              disabled={editData.quyenTaiKhoan === 'Người dùng'} 
              helperText={
                editData.quyenTaiKhoan === 'Người dùng' 
                ? "Dữ liệu được đồng bộ từ Chủ hộ (Không thể sửa)." 
                : "Nhập tên nhân viên quản lý."
              }
              onChange={(e) => setEditData({...editData, hoTen: e.target.value})}
            />

            {/* 4. CCCD (Khóa nếu là User, Mở nếu là Admin) */}
            <TextField 
              label="Số CCCD" 
              fullWidth 
              value={editData.cccd}
              disabled={editData.quyenTaiKhoan === 'Người dùng'}
              onChange={(e) => setEditData({...editData, cccd: e.target.value})}
            />

            {/* Hiển thị quyền (Chỉ xem, không sửa quyền ở đây để tránh lỗi logic) */}
            <TextField 
              label="Quyền hiện tại"
              fullWidth
              value={editData.quyenTaiKhoan}
              disabled
              variant="filled"
            />

          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenEdit(false)} color="inherit" variant="outlined">Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Lưu thay đổi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaiKhoanPage;