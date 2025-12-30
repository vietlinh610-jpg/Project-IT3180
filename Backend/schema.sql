GO


IF OBJECT_ID('dbo.tam_tru', 'U') IS NOT NULL DROP TABLE dbo.tam_tru;
IF OBJECT_ID('dbo.tam_vang', 'U') IS NOT NULL DROP TABLE dbo.tam_vang;
IF OBJECT_ID('dbo.nhan_khau', 'U') IS NOT NULL DROP TABLE dbo.nhan_khau;
IF OBJECT_ID('dbo.can_ho', 'U') IS NOT NULL DROP TABLE dbo.can_ho;
IF OBJECT_ID('dbo.ho_khau', 'U') IS NOT NULL DROP TABLE dbo.ho_khau;
IF OBJECT_ID('dbo.thu_phi', 'U') IS NOT NULL DROP TABLE dbo.thu_phi;
IF OBJECT_ID('dbo.khoan_thu', 'U') IS NOT NULL DROP TABLE dbo.khoan_thu;
IF OBJECT_ID('dbo.tai_khoan', 'U') IS NOT NULL DROP TABLE dbo.tai_khoan;
GO

CREATE TABLE ho_khau (
    MaHoKhau VARCHAR(20) PRIMARY KEY,
    DiaChiThuongTru NVARCHAR(200),
    NoiCap NVARCHAR(100),
    NgayCap DATE
);
GO

CREATE TABLE can_ho (
    MaCanHo VARCHAR(20) PRIMARY KEY,
    TenCanHo NVARCHAR(50),
    Tang INT,
    DienTich FLOAT,
    
    MaHoKhau VARCHAR(20), 
    
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE 
);
GO

CREATE TABLE nhan_khau (
    MaNhanKhau VARCHAR(20) PRIMARY KEY, -- Tự nhập: "NK001"
    
    MaHoKhau VARCHAR(20),
    
    HoTen NVARCHAR(100) NOT NULL,
    GioiTinh NVARCHAR(10), 
    NgaySinh DATE,
    DanToc NVARCHAR(50),
    TonGiao NVARCHAR(50),
    QuocTich NVARCHAR(50) DEFAULT N'Việt Nam',
    NgheNghiep NVARCHAR(100),
    SoCCCD VARCHAR(20),
    NoiSinh NVARCHAR(200),
    QuanHeVoiChuHo NVARCHAR(50), 
    
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);
GO

CREATE UNIQUE NONCLUSTERED INDEX IX_NhanKhau_CCCD ON nhan_khau(SoCCCD) WHERE SoCCCD IS NOT NULL;
GO

CREATE TABLE tam_vang (
    ID INT PRIMARY KEY IDENTITY(1,1), -- ID tự động (1, 2, 3...)
    
    MaNhanKhau VARCHAR(20) NOT NULL, -- Vẫn nối với mã tự nhập của bảng Nhân Khẩu
    
    NgayDi DATE,
    NgayVe DATE,
    LyDo NVARCHAR(255),
    
    -- Nếu mã nhân khẩu sửa NK01 -> NK99, bảng này tự cập nhật
    FOREIGN KEY (MaNhanKhau) REFERENCES nhan_khau(MaNhanKhau) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);
GO

CREATE TABLE tam_tru (
    ID INT PRIMARY KEY IDENTITY(1,1), -- ID tự động (1, 2, 3...)
    
    MaNhanKhau VARCHAR(20) NOT NULL, 
    
    TuNgay DATE,
    DenNgay DATE,
    LyDo NVARCHAR(255),
    
    FOREIGN KEY (MaNhanKhau) REFERENCES nhan_khau(MaNhanKhau) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);

CREATE TABLE tai_khoan (
    ID INT PRIMARY KEY IDENTITY(1,1),
    HoTen NVARCHAR(100) NOT NULL,
    SoCCCD VARCHAR(20) NOT NULL,
    MaHoKhau VARCHAR(20), 
    TenDangNhap VARCHAR(50) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    Quyen NVARCHAR(50) NOT NULL DEFAULT N'Người dùng',
    CONSTRAINT CK_TaiKhoan_Quyen CHECK (Quyen IN (N'Admin', N'Kế toán', N'Người dùng')),
    CONSTRAINT CK_Logic_MaHoKhau CHECK (
        (Quyen = N'Người dùng' AND MaHoKhau IS NOT NULL) 
        OR 
        (Quyen <> N'Người dùng' AND MaHoKhau IS NULL)
    ),
    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE
);
GO

CREATE UNIQUE NONCLUSTERED INDEX UQ_TaiKhoan_MaHoKhau_KhongNull
ON tai_khoan(MaHoKhau)
WHERE MaHoKhau IS NOT NULL;
GO

-- Xóa trigger cũ nếu có
IF OBJECT_ID('trg_ChongXoaAdmin', 'TR') IS NOT NULL DROP TRIGGER trg_ChongXoaAdmin;
GO

CREATE TRIGGER trg_ChongXoaAdmin
ON tai_khoan
FOR DELETE
AS
BEGIN
    -- Đếm số lượng Admin còn lại trong bảng sau khi lệnh xóa chạy
    DECLARE @CountAdmin INT;
    SELECT @CountAdmin = COUNT(*) FROM tai_khoan WHERE Quyen = N'Admin';

    -- Nếu không còn Admin nào -> Báo lỗi và Hoàn tác
    IF @CountAdmin < 1
    BEGIN
        PRINT N'LỖI: Không thể xóa! Hệ thống bắt buộc phải còn ít nhất 1 Admin.';
        ROLLBACK TRANSACTION; -- Hủy lệnh xóa
    END
END;
GO
-- Xóa trigger cũ nếu có
IF OBJECT_ID('trg_ChongSuaQuyenAdmin', 'TR') IS NOT NULL DROP TRIGGER trg_ChongSuaQuyenAdmin;
GO

CREATE TRIGGER trg_ChongSuaQuyenAdmin
ON tai_khoan
FOR UPDATE
AS
BEGIN
    -- Chỉ kiểm tra nếu cột "Quyen" bị thay đổi
    IF UPDATE(Quyen)
    BEGIN
        -- Đếm số Admin còn lại sau khi sửa
        DECLARE @CountAdmin INT;
        SELECT @CountAdmin = COUNT(*) FROM tai_khoan WHERE Quyen = N'Admin';

        -- Nếu số Admin về 0 -> Báo lỗi và Hoàn tác
        IF @CountAdmin < 1
        BEGIN
            PRINT N'LỖI: Không thể hạ quyền! Đây là Admin duy nhất còn lại.';
            ROLLBACK TRANSACTION; -- Hủy lệnh update
        END
    END
END;

GO
CREATE TABLE loai_phi (
    MaLoaiPhi VARCHAR(20) PRIMARY KEY,      -- Do kế toán đặt liên quan tới loại phí gì
    TenLoaiPhi NVARCHAR(100) NOT NULL,
    BatBuoc BIT DEFAULT 1,
    DonGia DECIMAL(18,2),
    DonVi NVARCHAR(50),                      -- 1 xe, ...?
    GhiChu NVARCHAR(255)
);
GO

CREATE TABLE thu_phi (
    ID INT PRIMARY KEY IDENTITY(1,1),

    MaHoKhau VARCHAR(20) NOT NULL,
    MaLoaiPhi VARCHAR(20) NOT NULL,

    Thang INT NOT NULL,
    Nam INT NOT NULL,

    SoLuong FLOAT DEFAULT 1,                 -- m2, số xe, số tháng
    DonGia DECIMAL(18,2),
    ThanhTien DECIMAL(18,2) NOT NULL,

    DaDong BIT DEFAULT 0,
    NgayDong DATE NULL,
    HinhThuc NVARCHAR(50),                   -- Tiền mặt, CK
    GhiChu NVARCHAR(255),

    FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHoKhau)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (MaLoaiPhi) REFERENCES loai_phi(MaLoaiPhi),

    CONSTRAINT UQ_ThuPhi UNIQUE (MaHoKhau, MaLoaiPhi, Thang, Nam)
);
GO