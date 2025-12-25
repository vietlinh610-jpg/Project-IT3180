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