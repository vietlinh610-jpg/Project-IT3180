
-- 1. Bảng Hộ khẩu
CREATE TABLE ho_khau (
    MaHo INT PRIMARY KEY IDENTITY(1,1),
    SoThanhVien INT DEFAULT 0,
    DiaChi NVARCHAR(200) NOT NULL
);

-- 2. Bảng Nhân khẩu
CREATE TABLE nhan_khau (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CMND VARCHAR(20) UNIQUE,
    Ten NVARCHAR(50) NOT NULL,
    Tuoi INT,
    SDT VARCHAR(15),
    MaHo INT,
    FOREIGN KEY (MaHo) REFERENCES ho_khau(MaHo) ON DELETE SET NULL
);

-- 3. Bảng Quan hệ
CREATE TABLE quan_he (
    MaHo INT,
    IDThanhVien INT,
    QuanHe NVARCHAR(30),
    PRIMARY KEY (MaHo, IDThanhVien),
    FOREIGN KEY (MaHo) REFERENCES ho_khau(MaHo),
    FOREIGN KEY (IDThanhVien) REFERENCES nhan_khau(ID)
);

-- 4. Bảng Chủ hộ
CREATE TABLE chu_ho (
    MaHo INT PRIMARY KEY,
    IDChuHo INT,
    Note NVARCHAR(255),
    FOREIGN KEY (MaHo) REFERENCES ho_khau(MaHo),
    FOREIGN KEY (IDChuHo) REFERENCES nhan_khau(ID)
);

-- 5. Bảng Khoản thu
CREATE TABLE khoan_thu (
    MaKhoanThu INT PRIMARY KEY IDENTITY(1,1),
    TenKhoanThu NVARCHAR(100) NOT NULL,
    SoTien FLOAT,    -- Trong SQL Server, DOUBLE tương ứng với FLOAT
    LoaiKhoanThu INT
);

-- 6. Bảng Nộp tiền
CREATE TABLE nop_tien (
    IDNopTien INT PRIMARY KEY IDENTITY(1,1),
    MaKhoanThu INT,
    IDThanhVien INT,
    NgayThu DATE DEFAULT GETDATE(),
    FOREIGN KEY (MaKhoanThu) REFERENCES khoan_thu(MaKhoanThu),
    FOREIGN KEY (IDThanhVien) REFERENCES nhan_khau(ID)
);

-- 7. Bảng Người dùng (Admin)
CREATE TABLE nguoi_dung (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(30) UNIQUE NOT NULL,
    Passwd VARCHAR(100) NOT NULL
);

-- 8. BẢNG TẠM VẮNG (Theo dõi cư dân đi vắng)

CREATE TABLE tam_vang (
    ID INT PRIMARY KEY IDENTITY(1,1),       -- Khóa chính tự tăng
    HoTen NVARCHAR(50) NOT NULL,            -- Khớp kiểu dữ liệu với bảng nhan_khau
    SoCCCD VARCHAR(20) NOT NULL,            -- Khớp kiểu dữ liệu với bảng nhan_khau
    MaHoKhau INT,                           -- Liên kết với hộ khẩu gốc
    NgayDi DATE NOT NULL,
    NgayVeDuKien DATE,
    LyDo NVARCHAR(255),
    TrangThai NVARCHAR(50) DEFAULT N'Chờ duyệt', -- Mặc định là Chờ duyệt
    -- Liên kết MaHoKhau với MaHo trong bảng ho_khau
    CONSTRAINT FK_TamVang_HoKhau FOREIGN KEY (MaHoKhau) REFERENCES ho_khau(MaHo)
);

-- 9. BẢNG TẠM TRÚ (Người mới đến ở)
CREATE TABLE tam_tru (
    ID INT PRIMARY KEY IDENTITY(1,1),       -- Khóa chính tự tăng
    MaGiayTamTru VARCHAR(20),               -- Mã giấy
    HoTen NVARCHAR(50) NOT NULL,
    SoCCCD VARCHAR(20) NOT NULL,
    MaCanHo INT,                            -- Mã căn hộ họ đến ở (Chính là MaHo)
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    LyDo NVARCHAR(255),                     -- Thường có lý do (Lao động, Sinh viên...)
    TrangThai NVARCHAR(50) DEFAULT N'Chờ duyệt',
    -- Liên kết MaCanHo với MaHo trong bảng ho_khau
    CONSTRAINT FK_TamTru_HoKhau FOREIGN KEY (MaCanHo) REFERENCES ho_khau(MaHo)
);
