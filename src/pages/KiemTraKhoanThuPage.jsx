// src/pages/CheckBillingPage.jsx
import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Chip, Button, Stack, IconButton, Tooltip 
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import VisibilityIcon from '@mui/icons-material/Visibility';

const KiemTraKhoanThuPage = () => {
  // Dữ liệu mẫu (Thực tế sẽ lấy từ API/Database)
  const [rows, setRows] = useState([
    { id: 1, tenKhoanThu: "Phí quản lý T12", nguoiNop: "Nguyễn Văn A", canHo: "P.805", thoiGian: "20/12/2023 08:30", trangThai: "Chờ xác nhận", soTien: "500,000" },
    { id: 2, tenKhoanThu: "Tiền điện T11", nguoiNop: "Trần Thị B", canHo: "P.102", thoiGian: "19/12/2023 15:45", trangThai: "Đã nộp", soTien: "1,250,000" },
    { id: 3, tenKhoanThu: "Phí gửi xe T12", nguoiNop: "Lê Văn C", canHo: "P.304", thoiGian: "-", trangThai: "Chưa nộp", soTien: "100,000" },
    { id: 4, tenKhoanThu: "Tiền nước T11", nguoiNop: "Phạm Minh D", canHo: "P.501", thoiGian: "21/12/2023 10:20", trangThai: "Chờ xác nhận", soTien: "210,000" },
  ]);

  // Hàm xử lý xác nhận nộp tiền
  const handleVerify = (id) => {
    setRows(prevRows => 
      prevRows.map(row => 
        row.id === id ? { ...row, trangThai: "Đã nộp" } : row
      )
    );
    alert("Đã xác nhận thanh toán thành công!");
  };

  const columns = [
    { field: 'tenKhoanThu', headerName: 'Tên khoản thu', width: 200 },
    { field: 'soTien', headerName: 'Số tiền (VNĐ)', width: 130 },
    { field: 'canHo', headerName: 'Căn hộ', width: 100, align: 'center' },
    { field: 'nguoiNop', headerName: 'Người nộp/Chủ hộ', width: 180 },
    { field: 'thoiGian', headerName: 'Ngày giờ nộp', width: 180 },
    { 
      field: 'trangThai', 
      headerName: 'Trạng thái', 
      width: 150,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "Đã nộp") color = "success";
        if (params.value === "Chưa nộp") color = "error";
        if (params.value === "Chờ xác nhận") color = "warning";
        return <Chip label={params.value} color={color} size="small" />;
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác xác nhận',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.trangThai === "Chờ xác nhận" && (
            <Tooltip title="Xác nhận đã nhận tiền">
              <IconButton color="success" onClick={() => handleVerify(params.id)}>
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Xem minh chứng">
            <IconButton size="small"><VisibilityIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Từ chối/Lỗi">
            <IconButton color="error" size="small"><DoDisturbIcon /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', boxSizing: 'border-box'  }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Kiểm tra & Xác nhận khoản thu
      </Typography>

      <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#fff' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                pageSizeOptions={[10, 20]}
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

export default KiemTraKhoanThuPage;