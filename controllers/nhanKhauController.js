const { connectDB, sql } = require('../config/db');

// format dữ liệu ngày để trả về FE
const formatDate = (dateObj) => {
    if (!dateObj) return '';
    return new Date(dateObj).toISOString().split('T')[0];
};

// Lấy thông tin chi tiết nhân khẩu
const getNhanKhauById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await connectDB();

        // Truy vấn nhân khẩu dựa theo id
        const result = await pool.request()
            .input('ID', sql.Int, id)
            .query('select * from nhan_khau where ID = @ID');
        
        // Nếu không tìm thấy cư dân -> Báo lỗi
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cư dân này' });
        }

        const data = result.recordset[0];

        const responseData = {
            id: data.ID,
            hoTen: data.Ten,
            cccd: data.CMND,
            gioiTinh: data.GioiTinh || '', // cast sang string tránh FE bị lỗi hiển thị null
            ngaySinh: formatDate(data.NgaySinh),
            soDienThoai: data.SDT || '',
            queQuan: data.QueQuan || '',
            danToc: data.DanToc || '',
            tonGiao: data.TonGiao || '',
            ngheNghiep: data.NgheNghiep || ''
        };

        return res.status(200).json(responseData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Cập nhật thông tin nhân khẩu
const updateNhanKhau = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { hoTen, cccd, gioiTinh, ngaySinh, soDienThoai, queQuan, danToc, tonGiao, ngheNghiep } = req.body;

        const pool = await connectDB();

        // Nếu không có cư dân có định danh ID thì báo lỗi
        const result = await pool.request()
            .input('ID', sql.Int, id)
            .query('select * from nhan_khau where ID = @ID');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cư dân này' });
        }

        await pool.request()
            .input('ID', sql.Int, id)
            .input('Ten', sql.NVarChar, hoTen)
            .input('CMND', sql.VarChar, cccd)
            .input('GioiTinh', sql.NVarChar, gioiTinh)
            .input('NgaySinh', sql.Date, ngaySinh)
            .input('SDT', sql.VarChar, soDienThoai)
            .input('QueQuan', sql.NVarChar, queQuan)
            .input('DanToc', sql.NVarChar, danToc)
            .input('TonGiao', sql.NVarChar, tonGiao)
            .input('NgheNghiep', sql.NVarChar, ngheNghiep)
            .query(`
                UPDATE nhan_khau 
                SET Ten = @Ten, 
                    CMND = @CMND, 
                    GioiTinh = @GioiTinh,
                    NgaySinh = @NgaySinh, 
                    SDT = @SDT, 
                    QueQuan = @QueQuan, 
                    DanToc = @DanToc, 
                    TonGiao = @TonGiao, 
                    NgheNghiep = @NgheNghiep
                WHERE ID = @ID
            `);

        return res.status(200).json({ message: 'Cập nhật thông tin thành công!' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getNhanKhauById,
    updateNhanKhau
};