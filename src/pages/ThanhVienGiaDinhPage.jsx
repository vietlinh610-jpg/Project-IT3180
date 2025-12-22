// src/pages/FamilyMembersPage.jsx
import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Chip, Stack 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';

const ThanhVienGiaDinhPage = () => {
  // Dữ liệu mẫu hộ gia đình
  const familyData = {
    maHoKhau: "HK26960674",
    tenCanHo: "P.805", // Thêm mới
    tang: "8",         // Thêm mới
    diaChi: "Căn hộ P.805, Tòa nhà BlueMoon, Thanh Xuân, Hà Nội",
    chuHo: "Nguyễn Văn A",
    members: [
      { id: 1, hoTen: "Nguyễn Văn A", quanHe: "Chủ hộ", ngaySinh: "15/05/1980", gioiTinh: "Nam", danToc: "Kinh", tonGiao: "Không", ngheNghiep: "Kỹ sư" },
      { id: 2, hoTen: "Trần Thị B", quanHe: "Vợ", ngaySinh: "20/10/1985", gioiTinh: "Nữ", danToc: "Kinh", tonGiao: "Không", ngheNghiep: "Giáo viên" },
      { id: 3, hoTen: "Đại Đào", quanHe: "Con", ngaySinh: "05/12/2010", gioiTinh: "Nam", danToc: "Kinh", tonGiao: "Không", ngheNghiep: "Học sinh" },
    ]
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#2c3e50' }}>
        Thông tin hộ gia đình
      </Typography>

      {/* Phần 1: Thông tin chung của hộ khẩu */}
      <Paper elevation={1} sx={{ p: 3, borderRadius: '12px', mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <HomeIcon sx={{ color: '#008ecc' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Thông tin chung</Typography>
            </Stack>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Mã hộ khẩu:</strong> <span style={{ color: '#008ecc', fontWeight: 'bold' }}>{familyData.maHoKhau}</span>
            </Typography>
            <Typography variant="body1">
              <strong>Chủ hộ:</strong> {familyData.chuHo}
            </Typography>
          </Grid>

          <Grid item xs={12} md={7} sx={{ mt: 1 }} >
            {/* Hiển thị Tên căn hộ và Tầng nổi bật hơn */}
            <Stack direction="row" spacing={4} sx={{ mt: { xs: 0, md: 5 }, mb: 1 }}>
               <Typography variant="body1">
                <strong>Căn hộ:</strong> {familyData.tenCanHo}
              </Typography>
              <Typography variant="body1">
                <strong>Tầng:</strong> {familyData.tang}
              </Typography>
            </Stack>

            <Typography variant="body1">
              <strong>Địa chỉ thường trú:</strong> {familyData.diaChi}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Phần 2: Danh sách thành viên */}
      <Paper elevation={1} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #eee' }}>
          <GroupsIcon sx={{ color: '#008ecc' }} />
          <Typography sx={{ fontWeight: 'bold' }}>Thành viên trong gia đình</Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: '#fafafa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Họ và tên</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quan hệ</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày sinh</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Giới tính</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Dân tộc</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tôn giáo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nghề nghiệp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {familyData.members.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{member.hoTen}</TableCell>
                  <TableCell>
                    <Chip 
                      label={member.quanHe} 
                      size="small" 
                      color={member.quanHe === 'Chủ hộ' ? 'primary' : 'default'}
                      variant={member.quanHe === 'Chủ hộ' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>{member.ngaySinh}</TableCell>
                  <TableCell>{member.gioiTinh}</TableCell>
                  <TableCell>{member.danToc}</TableCell>
                  <TableCell>{member.tonGiao}</TableCell>
                  <TableCell>{member.ngheNghiep}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ThanhVienGiaDinhPage;