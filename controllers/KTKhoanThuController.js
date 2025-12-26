const { connectDB, sql } = require("../config/db");

// TODO : Xác nhận khoản thu, từ chối lỗi, xem minh chứng!

// 1. Lấy các khoản thu từ bảng thu phí
// Ghi chú : Các khoản chưa nộp thì xem trong quản lý khoản thu tùy theo khoản thu
// Chỉ hiển thị các khoản thu đang chờ xác nhận nhằm mục đích xác nhận hợp lệ
const kiemTraThuPhi = async (req, res) =>  {
  try {
    const pool = await connectDB();

    query = `
    select kt.TenKhoanThu as TenKhoanThu, kt.SoTien as soTien,
      ch.MaCanHo as MaCanHo, nk.HoTen as ChuHo, tp.NgayDong as NgayGioNop
    from thu_phi tp
      join khoan_thu kt on tp.MaKhoanThu = kt.makhoanthu
      join ho_khau hk on tp.MaHoKhau = hk.MaHoKhau
      join nhan_khau nk on hk.MaHoKhau = nk.MaHoKhau and nk.QuanHeVoiChuHo = N'Chủ hộ'
      join can_ho ch on ch.MaHoKhau = hk.MaHoKhau
    where tp.DaXacNhan = 0;
    `
    const result = await pool.request().query(query);
    // Truy vấn những khoản thu đang chờ xác nhận và trả về kết quả
    return res.status(200).json({
      data:result.recordset,
    })
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi khi xem trạng thái đóng phí",
    });
  }
}

module.exports = {
  kiemTraThuPhi
};
