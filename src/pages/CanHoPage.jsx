// src/pages/CanHoPage.jsx
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
import { getCanHoList, deleteCanHo, updateCanHo } from '../services/canhoApi'; 

const CanHoPage = () => {
  const navigate = useNavigate();
  
  // State dữ liệu
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý chế độ sửa
  const [rowModesModel, setRowModesModel] = useState({});

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN CLICK ---

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
    if (window.confirm(`Bạn có chắc chắn muốn xóa căn hộ mã: ${id} không?`)) {
      try {
        await deleteCanHo(id);
        setRows(rows.filter((row) => row.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        // Hiển thị lỗi chi tiết từ Backend (VD: Đang có người ở)
        const message = error.response?.data?.message || "Xóa thất bại! Có lỗi xảy ra.";
        alert(message);
      }
    }
  };

  // --- HÀM UPDATE ĐÃ ĐƯỢC TỐI ƯU ---
  const processRowUpdate = async (newRow) => {
    try {
      // 1. Chỉ lấy MaHoKhau để gửi lên (Backend chỉ cần cái này)
      const updatedData = {
        MaHoKhau: newRow.maHoKhau || null // Nếu rỗng thì gửi null
      };

      // 2. Gọi API Update (newRow.id bây giờ là String "P101", đúng ý đồ)
      await updateCanHo(newRow.id, updatedData);

      // 3. Trả về row đã update để lưới hiển thị
      return newRow;

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      
      // 4. Hiển thị thông báo lỗi cụ thể từ Backend (VD: Mã hộ khẩu không tồn tại)
      const message = error.response?.data?.message || "Cập nhật thất bại! Vui lòng thử lại.";
      alert(message);
      
      throw error; // Ném lỗi để DataGrid giữ nguyên chế độ Edit (không thoát ra)
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    { field: 'maCanHo', headerName: 'Mã căn hộ', flex: 1, minWidth: 100, editable: false }, 
    { field: 'tenCanHo', headerName: 'Tên căn hộ', flex: 1, minWidth: 120, editable: false },
    { field: 'tang', headerName: 'Tầng', flex: 0.8, align: 'center', headerAlign: 'center', type: 'number', editable: false },
    { field: 'dienTich', headerName: 'Diện tích (m2)', flex: 1, align: 'center', headerAlign: 'center', type: 'number', editable: false },
    
    // Chỉ cột này được sửa
    { 
      field: 'maHoKhau', 
      headerName: 'Mã hộ khẩu', 
      flex: 1.2, 
      minWidth: 150, 
      editable: true 
    },
    
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      flex: 1.5,
      cellClassName: 'actions',
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

  const fetchCanHo = async () => {
    try {
      setLoading(true);
      const response = await getCanHoList();
      
      // Map dữ liệu: Backend trả về MaCanHo, ta gán nó vào id cho DataGrid dùng
      const formattedData = response.data.map((item) => ({
        id: item.MaCanHo, // Quan trọng: id của DataGrid chính là chuỗi "P101"
        maCanHo: item.MaCanHo,
        tenCanHo: item.TenCanHo,
        tang: item.Tang,
        dienTich: item.DienTich,
        maHoKhau: item.MaHoKhau
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
    fetchCanHo();
  }, []);

  return (
    <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Danh sách căn hộ
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => navigate('/ho-gia-dinh/can-ho/create')}
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

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          
          // --- SỬA QUAN TRỌNG: CHẶN CLICK ĐÚP ---
          onCellDoubleClick={(params, event) => {
            event.stopPropagation();
          }}
          // --------------------------------------

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

export default CanHoPage;