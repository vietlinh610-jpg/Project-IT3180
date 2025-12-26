const { query } = require("mssql");
const { connectDB, sql } = require("../config/db");

// 1. Xem trạng thái thu phí của hộ theo khoản thu
// Lấy danh sách các hộ kèm theo các khoản thu với trạng thái đã đóng, chưa đóng
const xemTrangThaiThuPhi = async (req, res) => {
  try {
    // Lấy mã khoản thu từ request
    const { maKhoanThu } = req.params;

    // ! Kiểm thử lại với database
    const pool = await connectDB();
    const query = `
      SELECT
          ch.MaCanHo as MaCanHo,
          nk.HoTen AS ChuHo,
          kt.SoTien AS SoTien,
          tp.NgayDong AS NgayNop,
          CASE
              WHEN tp.MaThuPhi IS NOT NULL THEN N'Đã nộp'
              ELSE N'Chưa nộp'
          END AS TrangThai
      FROM can_ho ch
      JOIN ho_khau hk
          ON ch.MaHoKhau = hk.MaHoKhau
      JOIN nhan_khau nk
          ON nk.MaHoKhau = hk.MaHoKhau AND nk.QuanHeVoiChuHo = N'Chủ hộ'
      JOIN khoan_thu kt
          ON kt.MaKhoanThu = @MaKhoanThu
      LEFT JOIN thu_phi tp
          ON tp.MaHoKhau = hk.MaHoKhau AND tp.MaKhoanThu = kt.MaKhoanThu;
    `;

    // Truy vấn
    const result = await pool
      .request()
      .input("MaKhoanThu", sql.Int, maKhoanThu)
      .query(query);

    return res.status(200).json({
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi xem trạng thái thu phí",
    });
  }
};

// 2. Lấy trạng thái của các khoản thu trong bảng thu_phi
// Phục vụ cho trang "Kiểm tra khoản thu"
const kiemTraKhoanThu = async (req, res) => {
  try {
    const pool = await connectDB();

    query = `
      select tp.SoTienPhaiThu as soTien, kt.TenKhoanThu as tenKhoanThu,
        nk.HoTen as chuHo, tp.NgayDong as ngayDaDong, tp.DaDong as daDong
      from thu_phi tp
        join ho_khau hk on tp.MaHoKhau = hk.MaHoKhau
        join nhan_khau nk on hk.MaHoKhau = nk.MaHoKhau
        join khoan_thu kt on tp.MaKhoanThu = kt.makhoanthu
      where nk.QuanHeVoiChuHo = N'Chu ho'
    `;
    
    const result = await pool.request().query(query);

    return res.status(200).json({
      data:result.recordset,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Error!",
    });
  }
}

module.exports = {
  xemTrangThaiThuPhi,
  kiemTraKhoanThu
};
