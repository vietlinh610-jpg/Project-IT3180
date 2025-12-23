// src/pages/HoKhauPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  DataGrid, 
  GridToolbar, 
  GridRowModes, 
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getHoKhauList, deleteHoKhau, updateHoKhau } from '../services/hokhauApi'; // Đảm bảo đã tạo file này

const HoKhauPage = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý chế độ sửa (Edit Mode)
  const [rowModesModel, setRowModesModel] = useState({});

  // --- 1. CALL API LẤY DANH SÁCH ---
  const fetchHoKhau = async () => {
    try {
      setLoading(true);
      const response = await getHoKhauList();
      
      // Map dữ liệu từ Backend (PascalCase) sang Frontend (camelCase)
      const formattedData = response.data.map((item) => ({
        id: item.MaHoKhau, // DataGrid bắt buộc phải có trường 'id'
        maHoKhau: item.MaHoKhau,
        soThanhVien: item.SoThanhVien, // Cột số lượng thành viên (Backend đã count)
        diaChi: item.DiaChiThuongTru,
        noiCap: item.NoiCap,
        ngayCap: item.NgayCap
      }));
      
      setRows(formattedData);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      alert("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoKhau();
  }, []);

  // --- 2. XỬ LÝ SỰ KIỆN CLICK (Edit/Save/Cancel/Delete) ---
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleDeleteClick = (id) => async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Hộ khẩu mã: ${id}?`)) {
      try {
        await deleteHoKhau(id);
        // Xóa thành công thì update lại state để giao diện tự mất dòng đó
        setRows(rows.filter((row) => row.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        // Hiển thị thông báo lỗi từ Backend (VD: Đang có nhân khẩu)
        const message = error.response?.data?.message || "Xóa thất bại!";
        alert(message);
      }
    }
  };

  // --- 3. XỬ LÝ UPDATE KHI BẤM LƯU ---
  const processRowUpdate = async (newRow) => {
    try {
      // Chuẩn bị dữ liệu gửi về Backend
      const updatedData = {
        DiaChiThuongTru: newRow.diaChi,
        NoiCap: newRow.noiCap,
        NgayCap: newRow.ngayCap // DataGrid sẽ trả về dạng Date Object hoặc String
      };

      await updateHoKhau(newRow.id, updatedData);
      return newRow; // Trả về row mới để Grid hiển thị
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
      throw error;
    }
  };

  // --- 4. CẤU HÌNH CỘT ---
  const columns = [
    { field: 'maHoKhau', headerName: 'Mã hộ khẩu', flex: 1, minWidth: 150, editable: false },
    
    // Cột Số thành viên (Lấy từ Backend, không cho sửa)
    { 
      field: 'soThanhVien', 
      headerName: 'Số thành viên', 
      flex: 0.8, 
      align: 'center', 
      headerAlign: 'center',
      type: 'number',
      editable: false 
    },

    { field: 'diaChi', headerName: 'Địa chỉ thường trú', flex: 1.5, minWidth: 200, editable: true },
    { field: 'noiCap', headerName: 'Nơi cấp', flex: 1, minWidth: 120, editable: true },
    
    // Cột Ngày cấp (Kiểu Date)
    { 
      field: 'ngayCap', 
      headerName: 'Ngày cấp', 
      flex: 1, 
      minWidth: 120,
      type: 'date',
      editable: true,
      // Chuyển đổi chuỗi ISO từ DB thành Date Object để DataGrid hiểu
      valueGetter: (value) => value && new Date(value),
      valueFormatter: (value) => {
      // Nếu có giá trị thì format, không thì để rỗng
      return value ? dayjs(value).format('DD/MM/YYYY') : '';
      },
    },
    
    // Cột Thao tác (Dùng type: 'actions' để hỗ trợ Inline Edit tốt nhất)
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      flex: 1.5,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      boxSizing: 'border-box' 
    }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách hộ khẩu
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => navigate('/ho-gia-dinh/ho-khau/create')}
        sx={{ mb: 3, width: 'fit-content', backgroundColor: '#008ecc' }}
      >
        ĐĂNG KÝ HỘ KHẨU
      </Button>

      <Box sx={{ 
        width: '100%', 
        flexGrow: 1, 
        minHeight: 0, 
        backgroundColor: '#fff' 
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          
          // Cấu hình Edit Mode
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          
          // Chặn click đúp để tránh vô tình sửa
          onCellDoubleClick={(params, event) => event.stopPropagation()}

          pageSizeOptions={[5, 10, 25, 50]}

          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            height: '100%', 
            width: '100%', 
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