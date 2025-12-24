
GO

-- ==================================================================================
-- XÓA DỮ LIỆU CŨ (Nếu có) ĐỂ TRÁNH TRÙNG LẶP KHI CHẠY LẠI
-- ==================================================================================
DELETE FROM tam_vang;
DELETE FROM tam_tru;
DELETE FROM nhan_khau;
UPDATE can_ho SET MaHoKhau = NULL; -- Gỡ liên kết trước khi xóa hộ khẩu
DELETE FROM can_ho;
DELETE FROM ho_khau;
GO

-- ==================================================================================
-- 1. GEN DATA: HỘ KHẨU (10 Hộ)
-- ==================================================================================
DECLARE @i INT = 1;
DECLARE @MaHK VARCHAR(20);
DECLARE @DiaChi NVARCHAR(200);

WHILE @i <= 10
BEGIN
    -- Tạo mã HK001, HK002...
    SET @MaHK = 'HK' + RIGHT('00' + CAST(@i AS VARCHAR(5)), 3); 
    
    -- Random địa chỉ quê quán
    SELECT @DiaChi = CASE CAST(RAND() * 5 AS INT)
        WHEN 0 THEN N'Thôn 1, Xã Hòa Bình, Huyện Thường Tín, Hà Nội'
        WHEN 1 THEN N'Số 12, Đường Lê Lợi, TP Vinh, Nghệ An'
        WHEN 2 THEN N'Xóm 5, Xã Xuân Trường, Nam Định'
        WHEN 3 THEN N'Khu 3, Phường Thanh Bình, TP Hải Dương'
        ELSE N'Thôn Đông, Xã An Hải, Huyện Lý Sơn, Quảng Ngãi'
    END;

    INSERT INTO ho_khau (MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap)
    VALUES (
        @MaHK, 
        @DiaChi, 
        N'Công an Tỉnh/TP', 
        DATEADD(DAY, -CAST(RAND()*3000 AS INT), GETDATE()) -- Ngày cấp ngẫu nhiên trong 8 năm qua
    );

    SET @i = @i + 1;
END;
PRINT '--> Đã tạo xong 10 Hộ khẩu.';

-- ==================================================================================
-- 2. GEN DATA: CĂN HỘ (20 Căn)
-- ==================================================================================
SET @i = 1;
DECLARE @MaCanHo VARCHAR(20);
DECLARE @MaHK_Random VARCHAR(20);

WHILE @i <= 20
BEGIN
    -- Tạo mã P101 -> P105, P201... (Giả lập 4 tầng, mỗi tầng 5 phòng)
    DECLARE @Tang INT = (@i - 1) / 5 + 1;
    DECLARE @Phong INT = (@i - 1) % 5 + 1;
    SET @MaCanHo = 'P' + CAST(@Tang AS VARCHAR) + RIGHT('0' + CAST(@Phong AS VARCHAR), 2);

    -- Logic: Các căn số chẵn thì có người ở (Gán Hộ khẩu), Căn lẻ để trống
    IF @i <= 10 -- Gán 10 hộ khẩu vừa tạo cho 10 căn đầu tiên
    BEGIN
        SET @MaHK_Random = 'HK' + RIGHT('00' + CAST(@i AS VARCHAR(5)), 3);
    END
    ELSE
    BEGIN
        SET @MaHK_Random = NULL; -- Nhà trống
    END

    INSERT INTO can_ho (MaCanHo, TenCanHo, Tang, DienTich, MaHoKhau)
    VALUES (
        @MaCanHo, 
        N'Căn hộ ' + @MaCanHo, 
        @Tang, 
        CASE WHEN @Phong IN (1,5) THEN 85.5 ELSE 60.0 END, -- Căn góc 85m2, căn giữa 60m2
        @MaHK_Random
    );

    SET @i = @i + 1;
END;
PRINT '--> Đã tạo xong 20 Căn hộ (10 căn có chủ, 10 căn trống).';

-- ==================================================================================
-- 3. GEN DATA: NHÂN KHẨU (30 Người)
-- ==================================================================================
SET @i = 1;
DECLARE @MaNK VARCHAR(20);
DECLARE @HoTen NVARCHAR(100);
DECLARE @GioiTinh NVARCHAR(10);
DECLARE @CCCD VARCHAR(20);
DECLARE @MaHK_Assign VARCHAR(20);
DECLARE @QuanHe NVARCHAR(50);

WHILE @i <= 30
BEGIN
    SET @MaNK = 'NK' + RIGHT('00' + CAST(@i AS VARCHAR(5)), 3);
    
    -- Random Họ Tên Tiếng Việt
    DECLARE @Ho NVARCHAR(20) = CASE CAST(RAND() * 5 AS INT) WHEN 0 THEN N'Nguyễn' WHEN 1 THEN N'Trần' WHEN 2 THEN N'Lê' WHEN 3 THEN N'Phạm' WHEN 4 THEN N'Hoàng' ELSE N'Vũ' END;
    DECLARE @Dem NVARCHAR(20) = CASE CAST(RAND() * 5 AS INT) WHEN 0 THEN N'Văn' WHEN 1 THEN N'Thị' WHEN 2 THEN N'Minh' WHEN 3 THEN N'Đức' WHEN 4 THEN N'Ngọc' ELSE N'Thanh' END;
    DECLARE @Ten NVARCHAR(20) = CASE CAST(RAND() * 5 AS INT) WHEN 0 THEN N'Anh' WHEN 1 THEN N'Bình' WHEN 2 THEN N'Châu' WHEN 3 THEN N'Dũng' WHEN 4 THEN N'Em' ELSE N'Hùng' END;
    SET @HoTen = @Ho + ' ' + @Dem + ' ' + @Ten;

    -- Giới tính (Nếu đệm là Thị thì Nữ, còn lại random)
    SET @GioiTinh = CASE WHEN @Dem = N'Thị' THEN N'Nữ' ELSE N'Nam' END;

    -- Phân bổ vào Hộ khẩu: 
    -- 10 người đầu tiên là Chủ hộ của 10 hộ khẩu
    -- 20 người sau là thành viên rải rác
    IF @i <= 10 
    BEGIN
        SET @MaHK_Assign = 'HK' + RIGHT('00' + CAST(@i AS VARCHAR(5)), 3);
        SET @QuanHe = N'Chủ hộ';
    END
    ELSE
    BEGIN
        -- Random vào hộ 1 đến 10
        DECLARE @RandomHKID INT = CAST(RAND() * 10 AS INT) + 1; 
        SET @MaHK_Assign = 'HK' + RIGHT('00' + CAST(@RandomHKID AS VARCHAR(5)), 3);
        SET @QuanHe = CASE CAST(RAND() * 3 AS INT) WHEN 0 THEN N'Con' WHEN 1 THEN N'Vợ' ELSE N'Chồng' END;
    END

    -- CCCD: Người lớn có số, Trẻ em (quan hệ là Con) có thể NULL
    IF @QuanHe = N'Con' AND RAND() > 0.5 
        SET @CCCD = NULL;
    ELSE
        SET @CCCD = '0012020' + RIGHT('00000' + CAST(@i AS VARCHAR), 5);

    INSERT INTO nhan_khau (
        MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, 
        DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, NoiSinh, QuanHeVoiChuHo
    )
    VALUES (
        @MaNK, 
        @MaHK_Assign, 
        @HoTen, 
        @GioiTinh, 
        DATEADD(DAY, -CAST(RAND()*20000 AS INT), GETDATE()), -- Random tuổi
        N'Kinh', N'Không', N'Việt Nam', 
        CASE WHEN @CCCD IS NULL THEN N'Học sinh' ELSE N'Nhân viên văn phòng' END,
        @CCCD, 
        N'Hà Nội', 
        @QuanHe
    );

    SET @i = @i + 1;
END;
PRINT '--> Đã tạo xong 30 Nhân khẩu.';

-- ==================================================================================
-- 4. GEN DATA: TẠM VẮNG (2 phiếu)
-- ==================================================================================
-- Giả sử nhân khẩu NK002 đi nghĩa vụ quân sự
INSERT INTO tam_vang (MaNhanKhau, NgayDi, NgayVe, LyDo)
VALUES 
('NK002', '2024-01-15', '2026-01-15', N'Đi nghĩa vụ quân sự'),
('NK015', '2024-05-01', '2024-05-10', N'Đi công tác Đà Nẵng');

PRINT '--> Đã tạo xong dữ liệu Tạm vắng.';

-- ==================================================================================
-- 5. GEN DATA: TẠM TRÚ (2 phiếu)
-- ==================================================================================
-- Tạm trú cho nhân khẩu NK025 và NK026 (Giả sử họ là người nơi khác đến ở nhờ)
INSERT INTO tam_tru (MaNhanKhau, TuNgay, DenNgay, LyDo)
VALUES 
('NK025', '2024-02-01', '2024-08-01', N'Lên thành phố học đại học'),
('NK026', '2024-03-10', NULL, N'Đến làm việc tại khu công nghiệp'); 
-- Lưu ý: NK025, NK026 đã được tạo ở bảng nhan_khau bên trên rồi mới insert vào đây được

PRINT '--> Đã tạo xong dữ liệu Tạm trú.';
PRINT '===========================================';
PRINT 'HOÀN TẤT GEN DỮ LIỆU!';

INSERT INTO tai_khoan (HoTen, SoCCCD, MaHoKhau, TenDangNhap, MatKhau, Quyen)
VALUES (N'Quản trị viên 1', '000000001', NULL, 'admin', '123', N'Admin');

-- 2. Tạo Kế toán 2 (MaHoKhau NULL) -> Thành công (Không bị lỗi trùng NULL)
INSERT INTO tai_khoan (HoTen, SoCCCD, MaHoKhau, TenDangNhap, MatKhau, Quyen)
VALUES (N'Kế toán viên', '000000002', NULL, 'ketoan', '123', N'Kế toán');

-- 3. Tạo User A (HK01) -> Thành công
INSERT INTO tai_khoan (HoTen, SoCCCD, MaHoKhau, TenDangNhap, MatKhau, Quyen)
VALUES (N'Nguyễn Văn A', '038000001', 'HK001', 'user', '123', N'Người dùng');