// Hoàn thiện page khoản thu

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Minh họa minh chứng chuyển khoản
// Chú ý : Đây chỉ là minh họa, thực tế không nên lưu ảnh trên cơ sở dữ liệu
import minhChungImg from "../assets/minhChung.png";

import {
  KiemTraKhoanThu,
  xacNhanKhoanThu,
  tuChoiKhoanThu,
} from "../services/KTKhoanThuApi";

const KiemTraKhoanThuPage = () => {
  // Quản lý state của các hàng
  const [rows, setRows] = useState([]);

  // State điều khiển dialog xem minh chứng
  const [openMinhChung, setOpenMinhChung] = useState(false);

  // Lấy dữ liệu các khoản thu đang chờ xác nhận
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await KiemTraKhoanThu();
        if (response.data && response.data.data) {
          const mappedRows = response.data.data.map((item) => ({
            id: item.maThuPhi,
            tenKhoanThu: item.TenKhoanThu,
            soTien: item.soTien,
            canHo: item.MaCanHo,
            nguoiNop: item.ChuHo,
            thoiGian: item.NgayGioNop
              ? new Date(item.NgayGioNop).toLocaleString("vi-VN")
              : "",
            // Trạng thái luôn là chờ xác nhận
            trangThai: "Chờ xác nhận",
          }));
          setRows(mappedRows);
        }
      } catch (error) {
        console.error("Lỗi: ", error);
      }
    };

    fetchData();
  }, []);

  // Kiểm tra xác nhận
  const handleVerify = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xác nhận khoản thu này?")) return;

    try {
      await xacNhanKhoanThu(id);
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, trangThai: "Đã nộp" } : row
        )
      );
    } catch (error) {
      console.error("Lỗi :", error);
      alert("Xác nhận thất bại!");
    }
  };

  // Xử lý từ chối
  const handleReject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn TỪ CHỐI khoản thu này?")) return;

    try {
      await tuChoiKhoanThu(id);
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, trangThai: "Từ chối" } : row
        )
      );
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      alert("Từ chối thất bại!");
    }
  };

  // Mở dialog xem minh chứng
  const handleOpenMinhChung = () => {
    setOpenMinhChung(true);
  };

  // Đóng dialog xem minh chứng
  const handleCloseMinhChung = () => {
    setOpenMinhChung(false);
  };

  const columns = [
    { field: "tenKhoanThu", headerName: "Tên khoản thu", width: 200 },
    { field: "soTien", headerName: "Số tiền (VNĐ)", width: 140 },
    { field: "canHo", headerName: "Căn hộ", width: 100 },
    { field: "nguoiNop", headerName: "Người nộp", width: 180 },
    { field: "thoiGian", headerName: "Ngày giờ nộp", width: 180 },
    {
      field: "trangThai",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => {
        let color = "default";
        if (params.value === "Đã nộp") color = "success";
        if (params.value === "Từ chối") color = "error";
        if (params.value === "Chờ xác nhận") color = "warning";
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.row.trangThai === "Chờ xác nhận" && (
            <>
              <Tooltip title="Xác nhận đã thu tiền">
                <IconButton
                  color="success"
                  onClick={() => handleVerify(params.id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Từ chối khoản thu">
                <IconButton
                  color="error"
                  onClick={() => handleReject(params.id)}
                >
                  <DoDisturbIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <Tooltip title="Xem minh chứng">
            <IconButton size="small" onClick={handleOpenMinhChung}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, height: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Kiểm tra & Xác nhận khoản thu
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
      />

      {/* Dialog hiển thị minh chứng chuyển khoản */}
      <Dialog
        open={openMinhChung}
        onClose={handleCloseMinhChung}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Minh chứng chuyển khoản</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={minhChungImg}
            alt="Minh chứng chuyển khoản"
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default KiemTraKhoanThuPage;