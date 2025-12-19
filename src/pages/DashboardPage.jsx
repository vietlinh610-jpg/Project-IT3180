// src/pages/DashboardPage.jsx
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FunctionCard from '../components/FunctionCard';

const DashboardPage = () => {
  const cardsData = [
    {
      title: "Quản lý hộ khẩu",
      description: "Quản lý hộ khẩu và các khoản thu theo hộ",
      imageUrl: "/images/ho_khau.jpg",
      linkTo: "/ho-gia-dinh/ho-khau",
    },
    {
      title: "Quản lý căn hộ",
      description: "Quản lý các căn hộ trong chung cư",
      imageUrl: "/images/chung_cu.webp",
      linkTo: "/ho-gia-dinh/can-ho",
    },
    {
      title: "Quản lý khoản thu",
      description: "Quản lý các khoản thu phí trong chung cư",
      imageUrl: "/images/thu_chi.png",
      linkTo: "/quan-ly-khoan-thu",
    },
    {
      title: "Quản lý nhân khẩu",
      description: "Quản lý nhân khẩu, đăng ký nhân khẩu",
      imageUrl: "/images/nhan_khau.webp",
      linkTo: "/quan-ly-nhan-dan/nhan-khau",
    },
    {
      title: "Quản lý tạm trú",
      description: "Quản lý tạm trú, đăng ký tạm trú",
      imageUrl: "/images/tam_tru.png",
      linkTo: "/quan-ly-nhan-dan/tam-tru",
    },
    {
      title: "Quản lý tạm vắng",
      description: "Quản lý tạm vắng, đăng ký tạm vắng",
      imageUrl: "/images/tam_vang.jpg",
      linkTo: "/quan-ly-nhan-dan/tam-vang",
    },
  ];

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* Tiêu đề trang – giống HoKhauPage */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Bảng điều khiển
      </Typography>

      {/* Container nội dung chính */}
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <Grid container spacing={3}>
          {cardsData.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FunctionCard
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                linkTo={card.linkTo}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
