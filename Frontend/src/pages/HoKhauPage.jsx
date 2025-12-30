// src/pages/HoKhauPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  DataGrid, 
  GridToolbar, 
  GridRowModes, 
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search'; // Thêm icon tìm kiếm
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getHoKhauList, deleteHoKhau, updateHoKhau } from '../services/hokhauApi';

const HoKhauPage = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- THÊM STATE TÌM KIẾM ---
  const [searchText, setSearchText] = useState('');
  
  // State quản lý chế độ sửa (Edit Mode)
  const [rowModesModel, setRowModesModel] = useState({});

  // --- 1. CALL API LẤY DANH SÁCH ---
  const fetchHoKhau = async () => {
    try {
      setLoading(true);
      const response = await getHoKhauList();
      
      const formattedData = response.data.map((item) => ({
        id: item.MaHoKhau,
        maHoKhau: item.MaHoKhau,
        soThanhVien: item.SoThanhVien,
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

  // --- LOGIC LỌC DỮ LIỆU TÌM KIẾM ---
  const filteredRows = rows.filter((row) => {
    const searchLower = searchText.toLowerCase();
    return (
      row.maHoKhau?.toLowerCase().includes(searchLower) ||
      row.diaChi?.toLowerCase().includes(searchLower) ||
      row.noiCap?.toLowerCase().includes(searchLower)
    );
  });

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
        setRows(rows.filter((row) => row.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        const message = error.response?.data?.message || "Xóa thất bại!";
        alert(message);
      }
    }
  };

  // --- 3. XỬ LÝ UPDATE KHI BẤM LƯU ---
  const processRowUpdate = async (newRow, oldRow) => { // <-- 1. Thêm oldRow vào đây
    // --- 2. VALIDATION (Kiểm tra dữ liệu rỗng) ---
    
    // Kiểm tra Địa chỉ thường trú
    if (!newRow.diaChi || newRow.diaChi.toString().trim() === '') {
      alert("Lỗi: Địa chỉ thường trú không được để trống!");
      return oldRow; // Trả về dữ liệu cũ (Hủy thay đổi)
    }

    // Kiểm tra Nơi cấp
    if (!newRow.noiCap || newRow.noiCap.toString().trim() === '') {
      alert("Lỗi: Nơi cấp không được để trống!");
      return oldRow;
    }

    // Kiểm tra Ngày cấp
    if (!newRow.ngayCap) {
      alert("Lỗi: Ngày cấp không được để trống!");
      return oldRow;
    }

    // --- 3. GỌI API (Nếu dữ liệu hợp lệ) ---
    try {
      const updatedData = {
        DiaChiThuongTru: newRow.diaChi,
        NoiCap: newRow.noiCap,
        NgayCap: newRow.ngayCap // Lưu ý: Cần format date nếu backend yêu cầu YYYY-MM-DD
      };

      await updateHoKhau(newRow.id, updatedData);
      setRows((prevRows) => 
        prevRows.map((row) => (row.id === newRow.id ? newRow : row))
      );
      return newRow; // Cập nhật thành công
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
      return oldRow; // API lỗi thì quay về dữ liệu cũ
    }
  };
  // --- 4. CẤU HÌNH CỘT ---
  const columns = [
    { field: 'maHoKhau', headerName: 'Mã hộ khẩu', flex: 1, minWidth: 150, editable: false },
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
    { 
      field: 'ngayCap', 
      headerName: 'Ngày cấp', 
      flex: 1, 
      minWidth: 120,
      type: 'date',
      editable: true,
      valueGetter: (value) => value && new Date(value),
      valueFormatter: (value) => {
        return value ? dayjs(value).format('DD/MM/YYYY') : '';
      },
    },
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
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
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

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/ho-gia-dinh/ho-khau/create')}
          sx={{ width: 'fit-content', backgroundColor: '#008ecc' }}
        >
          ĐĂNG KÝ HỘ KHẨU
        </Button>

        {/* --- Ô TÌM KIẾM TÙY CHỈNH --- */}
        <TextField
          size="small"
          placeholder="Tìm theo mã HK, địa chỉ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: 300, backgroundColor: '#fff' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ 
        width: '100%', 
        flexGrow: 1, 
        minHeight: 0, 
        backgroundColor: '#fff' 
      }}>
        <DataGrid
          rows={filteredRows} // TRUYỀN DỮ LIỆU ĐÃ LỌC VÀO ĐÂY
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
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