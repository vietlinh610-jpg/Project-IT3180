const { connectDB, sql } = require("../config/db");

// 1. Xem trạng thái thu phí của hộ theo khoản thu
// Nếu là tự nguyên -> Chỉ hiện các hộ đã đóng góp
// Nếu là bắt buộc -> Hiện tất cả các hộ kèm theo trạng thái đã đóng, chưa đóng
const xemTrangThaiThuPhi = async (req, res) => {
  try {
    // Lấy mã khoản thu từ request
    const { maKhoanThu } = req.params;

    const pool = await connectDB();

    // Lấy loại khoản thu từ mã khoản thu (tự nguyện hoặc bắt buộc)
    const loaiResult = await pool
      .request()
      .input("MaKhoanThu", sql.Int, maKhoanThu).query(`
        SELECT Loai 
        FROM khoan_thu 
        WHERE MaKhoanThu = @MaKhoanThu
      `);

    const loai = loaiResult.recordset[0].Loai;
    let query = "";

    if (loai === "bat buoc") {
      query = `
        SELECT
            nk.HoTen as chuHo
            hk.MaHoKhau,
            tp.SoTienPhaiThu,
            ISNULL(tp.DaDong, 0) AS DaDong,
            tp.NgayDong
        FROM ho_khau hk
          LEFT JOIN thu_phi tp
            ON hk.MaHoKhau = tp.MaHoKhau
            AND tp.MaKhoanThu = @MaKhoanThu
          JOIN nhan_khau nk
            ON hk.MaHoKhau = nk.MaHoKhau
        ORDER BY hk.MaHoKhau
      `;
    } else {
      query = `
        SELECT
            hk.MaHoKhau,
            hk.DiaChiThuongTru,
            tp.SoTienPhaiThu,
            tp.DaDong,
            tp.NgayDong,
            tp.GhiChu
        FROM thu_phi tp
        JOIN ho_khau hk ON tp.MaHoKhau = hk.MaHoKhau
        JOIN nhan_khau nk on hk.MaHoKhau = nk.MaHoKhau
        WHERE tp.MaKhoanThu = @MaKhoanThu
        ORDER BY tp.NgayDong DESC
      `;
    }

    // Truy vấn
    const result = await pool
      .request()
      .input("MaKhoanThu", sql.Int, maKhoanThu)
      .query(query);

    return res.status(200).json({
      loaiKhoanThu: loai,
      data: result.recordset,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi không xác định",
    });
  }
};

module.exports = {
  xemTrangThaiThuPhi,
};
