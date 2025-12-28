const { connectDB, sql } = require('../config/db');

// 1. LẤY DANH SÁCH CĂN HỘ
const getListCanHo = async (req, res) => {
    try {
        const pool = await connectDB();
        // Query không đổi, nhưng dữ liệu trả về MaCanHo sẽ là String (VD: "P101")
        const query = `
            SELECT MaCanHo, TenCanHo, Tang, DienTich, MaHoKhau 
            FROM can_ho
        `;
        const result = await pool.request().query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
    }
};

// 2. THÊM CĂN HỘ MỚI
const createCanHo = async (req, res) => {
    try {
        // Lấy dữ liệu từ Frontend gửi lên
        const { MaCanHo, TenCanHo, Tang, DienTich, MaHoKhau } = req.body;
        
        const pool = await connectDB();
        
        await pool.request()
            // --- SỬA QUAN TRỌNG: Đổi kiểu dữ liệu sang VarChar ---
            .input('MaCanHo', sql.VarChar, MaCanHo)     // Nhập tay: "P101"
            .input('TenCanHo', sql.NVarChar, TenCanHo)
            .input('Tang', sql.Int, Tang)
            .input('DienTich', sql.Float, DienTich)
            // MaHoKhau là VarChar, nếu rỗng thì set null
            .input('MaHoKhau', sql.VarChar, MaHoKhau || null) 
            .query(`
                INSERT INTO can_ho (MaCanHo, TenCanHo, Tang, DienTich, MaHoKhau)
                VALUES (@MaCanHo, @TenCanHo, @Tang, @DienTich, @MaHoKhau)
            `);
            
        res.status(201).json({ message: "Thêm căn hộ thành công!" });
    } catch (err) {
        // Xử lý lỗi trùng khóa chính (Trùng MaCanHo)
        if (err.number === 2627 || err.number === 2601) {
             return res.status(409).json({ 
                message: `Thất bại! Mã căn hộ '${req.body.MaCanHo}' đã tồn tại.`, 
                field: "MaCanHo"
            });
        }

        console.error("Lỗi thêm mới:", err);
        res.status(500).json({ message: "Lỗi Server", error: err.message });
    }
};

// 3. SỬA CĂN HỘ (CẬP NHẬT HỘ KHẨU VÀO Ở)
const updateCanHo = async (req, res) => {
    try {
        const { id } = req.params; // id bây giờ là String (VD: "P101")
        const { MaHoKhau } = req.body; 
        
        const pool = await connectDB();

        await pool.request()
            // --- SỬA QUAN TRỌNG: id là VarChar ---
            .input('MaCanHo', sql.VarChar, id) 
            .input('MaHoKhau', sql.VarChar, MaHoKhau || null) // Cho phép gỡ hộ khẩu (null)
            .query(`
                UPDATE can_ho 
                SET MaHoKhau = @MaHoKhau
                WHERE MaCanHo = @MaCanHo
            `);

        res.status(200).json({ message: "Cập nhật thành công!" });
    } catch (err) {
        // Lỗi khóa ngoại: Nếu nhập MaHoKhau không tồn tại trong bảng ho_khau
        if (err.number === 547) { 
            return res.status(400).json({ message: "Mã hộ khẩu không tồn tại!" });
        }
        res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
    }
};

// 4. XÓA CĂN HỘ
const deleteCanHo = async (req, res) => {
    try {
        const { id } = req.params; // id là String (VD: "P101")
        const pool = await connectDB();

        // BƯỚC 1: Kiểm tra tồn tại & trạng thái
        const checkRequest = await pool.request()
            .input('MaCanHo', sql.VarChar, id) // --- SỬA: sql.VarChar ---
            .query('SELECT MaHoKhau FROM can_ho WHERE MaCanHo = @MaCanHo');
            
        if (checkRequest.recordset.length === 0) {
            return res.status(404).json({ message: "Căn hộ không tồn tại!" });
        }

        const canHo = checkRequest.recordset[0];

        // BƯỚC 2: Chặn xóa nếu đang có người ở
        if (canHo.MaHoKhau !== null) {
            return res.status(400).json({ 
                message: `Không thể xóa! Căn hộ đang có hộ khẩu ${canHo.MaHoKhau} cư trú.`,
                reason: "MaHoKhau is not null" 
            });
        }

        // BƯỚC 3: Xóa
        await pool.request()
            .input('MaCanHo', sql.VarChar, id) // --- SỬA: sql.VarChar ---
            .query('DELETE FROM can_ho WHERE MaCanHo = @MaCanHo');

        res.status(200).json({ message: "Đã xóa căn hộ thành công!" });

    } catch (err) {
        console.error("Lỗi xóa căn hộ:", err.message);
        
        // Lỗi khóa ngoại (Ví dụ: Căn hộ này đang dính ở bảng Tạm Trú)
        if (err.message.includes('REFERENCE constraint')) {
             return res.status(400).json({ 
                message: "Không thể xóa! Căn hộ này đang có dữ liệu liên quan (Hóa đơn).", 
                error: err.message 
            });
        }

        res.status(500).json({ message: "Lỗi Server khi xóa", error: err.message });
    }
};

module.exports = { getListCanHo, createCanHo, updateCanHo, deleteCanHo };