
SET NOCOUNT ON;

PRINT N'Đang dọn dẹp dữ liệu cũ...';

-- Tắt ràng buộc để xóa nhanh
EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT all';

DELETE FROM thu_phi;
DELETE FROM tam_tru;
DELETE FROM tam_vang;
DELETE FROM nhan_khau; 
DELETE FROM can_ho; 
DELETE FROM ho_khau; 
DELETE FROM tai_khoan WHERE Quyen IN (N'Người dùng'); -- Giữ lại admin/ketoan

-- Bật lại ràng buộc
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all';

-- Reset ID tự tăng
DBCC CHECKIDENT ('tam_tru', RESEED, 0);
DBCC CHECKIDENT ('tam_vang', RESEED, 0);
DBCC CHECKIDENT ('thu_phi', RESEED, 0);

-- Reset Loại phí
DELETE FROM loai_phi;
INSERT INTO loai_phi (MaLoaiPhi, TenLoaiPhi, BatBuoc, DonGia, DonVi, GhiChu) VALUES
('PQL', N'Phí Quản Lý', 1, 6000, N'm2', N'Bắt buộc'),
('GUIMAY', N'Phí Gửi Xe Máy', 0, 80000, N'xe', N'Tùy chọn'),
('GUIOTO', N'Phí Gửi Ô tô', 0, 1000000, N'xe', N'Tùy chọn');

-- ==================================================================================
-- 2. KHỞI TẠO DỮ LIỆU MẪU (HỌ TÊN, NGHỀ...)
-- ==================================================================================
DECLARE @Ho TABLE (Val NVARCHAR(50));
INSERT INTO @Ho VALUES (N'Nguyễn'),(N'Trần'),(N'Lê'),(N'Phạm'),(N'Hoàng'),(N'Huỳnh'),(N'Phan'),(N'Vũ'),(N'Võ'),(N'Đặng'),(N'Bùi'),(N'Đỗ'),(N'Hồ'),(N'Ngô');

DECLARE @DemNam TABLE (Val NVARCHAR(50));
INSERT INTO @DemNam VALUES (N'Văn'),(N'Hữu'),(N'Đức'),(N'Thành'),(N'Công'),(N'Minh'),(N'Quang'),(N'Tuấn'),(N'Thế'),(N'Mạnh');

DECLARE @TenNam TABLE (Val NVARCHAR(50));
INSERT INTO @TenNam VALUES (N'Hùng'),(N'Dũng'),(N'Nam'),(N'Hải'),(N'Minh'),(N'Hiếu'),(N'Thắng'),(N'Quân'),(N'Tuấn'),(N'Trung'),(N'Kiên'),(N'Cường'),(N'Long');

DECLARE @DemNu TABLE (Val NVARCHAR(50));
INSERT INTO @DemNu VALUES (N'Thị'),(N'Ngọc'),(N'Thu'),(N'Phương'),(N'Thanh'),(N'Hồng'),(N'Khánh'),(N'Mỹ');

DECLARE @TenNu TABLE (Val NVARCHAR(50));
INSERT INTO @TenNu VALUES (N'Lan'),(N'Huệ'),(N'Mai'),(N'Đào'),(N'Trang'),(N'Hương'),(N'Linh'),(N'Thảo'),(N'Huyền'),(N'Tâm'),(N'Tuyết'),(N'Vy');

DECLARE @NoiSinh TABLE (Val NVARCHAR(100));
INSERT INTO @NoiSinh VALUES (N'Hà Nội'),(N'Hồ Chí Minh'),(N'Hải Phòng'),(N'Đà Nẵng'),(N'Nam Định'),(N'Thái Bình'),(N'Nghệ An'),(N'Thanh Hóa');

DECLARE @NgheNghiep TABLE (Val NVARCHAR(100));
INSERT INTO @NgheNghiep VALUES (N'Kỹ sư'),(N'Giáo viên'),(N'Bác sĩ'),(N'Kế toán'),(N'Kinh doanh'),(N'Công chức'),(N'Nhân viên VP'),(N'Công nhân');

-- ==================================================================================
-- 3. SINH DỮ LIỆU CĂN HỘ & NHÂN KHẨU (10 Tầng x 10 Phòng)
-- ==================================================================================
PRINT N'Đang sinh dữ liệu cư dân...';

DECLARE @Tang INT = 1;
DECLARE @GlobalNK INT = 1;

WHILE @Tang <= 10
BEGIN
    DECLARE @Phong INT = 1;
    WHILE @Phong <= 10
    BEGIN
        -- A. Tạo Căn hộ & Hộ khẩu
        DECLARE @MaCanHo VARCHAR(20) = 'P' + CAST(@Tang AS VARCHAR) + RIGHT('0' + CAST(@Phong AS VARCHAR), 2);
        DECLARE @MaHoKhau VARCHAR(20) = 'HK_' + @MaCanHo;
        DECLARE @DienTich FLOAT = 60 + (ABS(CHECKSUM(NEWID())) % 60);

        INSERT INTO ho_khau (MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap)
        VALUES (@MaHoKhau, @MaCanHo + N', Chung cư BlueMoon', N'CA Hà Nội', DATEADD(DAY, -ABS(CHECKSUM(NEWID()) % 2000), GETDATE()));

        INSERT INTO can_ho (MaCanHo, TenCanHo, Tang, DienTich, MaHoKhau)
        VALUES (@MaCanHo, N'Căn hộ ' + @MaCanHo, @Tang, @DienTich, @MaHoKhau);

        -- B. Tạo Chủ hộ
        DECLARE @GioiTinhCH NVARCHAR(10) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN N'Nam' ELSE N'Nữ' END;
        DECLARE @TuoiCH INT = 30 + (ABS(CHECKSUM(NEWID())) % 26); 
        
        DECLARE @HoTenCH NVARCHAR(100);
        IF @GioiTinhCH = N'Nam' SELECT TOP 1 @HoTenCH = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNam D, @TenNam T ORDER BY NEWID();
        ELSE SELECT TOP 1 @HoTenCH = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNu D, @TenNu T ORDER BY NEWID();

        DECLARE @NoiSinhCH NVARCHAR(100); SELECT TOP 1 @NoiSinhCH = Val FROM @NoiSinh ORDER BY NEWID();
        DECLARE @NgheCH NVARCHAR(100); SELECT TOP 1 @NgheCH = Val FROM @NgheNghiep ORDER BY NEWID();
        
        DECLARE @CCCD_CH VARCHAR(20) = CAST(100000000 + @GlobalNK AS VARCHAR);
        DECLARE @MaNK_CH VARCHAR(20) = 'NK' + RIGHT('00000' + CAST(@GlobalNK AS VARCHAR), 5); SET @GlobalNK = @GlobalNK + 1;

        INSERT INTO nhan_khau (MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, NoiSinh, QuanHeVoiChuHo)
        VALUES (@MaNK_CH, @MaHoKhau, @HoTenCH, @GioiTinhCH, DATEADD(YEAR, -@TuoiCH, GETDATE()), N'Kinh', N'Không', N'Việt Nam', @NgheCH, @CCCD_CH, @NoiSinhCH, N'Chủ hộ');

        INSERT INTO tai_khoan (HoTen, SoCCCD, MaHoKhau, TenDangNhap, MatKhau, Quyen)
        VALUES (@HoTenCH, @CCCD_CH, @MaHoKhau, 'user_' + @MaCanHo, '123456', N'Người dùng');

        -- C. Tạo Vợ/Chồng (80%)
        IF (ABS(CHECKSUM(NEWID())) % 100) < 80 
        BEGIN
            DECLARE @GioiTinhVC NVARCHAR(10) = CASE WHEN @GioiTinhCH = N'Nam' THEN N'Nữ' ELSE N'Nam' END;
            DECLARE @QuanHeVC NVARCHAR(50) = CASE WHEN @GioiTinhCH = N'Nam' THEN N'Vợ' ELSE N'Chồng' END;
            DECLARE @TuoiVC INT = @TuoiCH + (ABS(CHECKSUM(NEWID())) % 6) - 3;
            
            DECLARE @HoTenVC NVARCHAR(100);
            IF @GioiTinhVC = N'Nam' SELECT TOP 1 @HoTenVC = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNam D, @TenNam T ORDER BY NEWID();
            ELSE SELECT TOP 1 @HoTenVC = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNu D, @TenNu T ORDER BY NEWID();

            DECLARE @NgheVC NVARCHAR(100); SELECT TOP 1 @NgheVC = Val FROM @NgheNghiep ORDER BY NEWID();
            DECLARE @CCCD_VC VARCHAR(20) = CAST(100000000 + @GlobalNK AS VARCHAR);
            DECLARE @MaNK_VC VARCHAR(20) = 'NK' + RIGHT('00000' + CAST(@GlobalNK AS VARCHAR), 5); SET @GlobalNK = @GlobalNK + 1;

            INSERT INTO nhan_khau (MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, NoiSinh, QuanHeVoiChuHo)
            VALUES (@MaNK_VC, @MaHoKhau, @HoTenVC, @GioiTinhVC, DATEADD(YEAR, -@TuoiVC, GETDATE()), N'Kinh', N'Không', N'Việt Nam', @NgheVC, @CCCD_VC, @NoiSinhCH, @QuanHeVC);

            -- D. Tạo Con (70%)
            IF (ABS(CHECKSUM(NEWID())) % 100) < 70
            BEGIN
                DECLARE @SoCon INT = 1 + (ABS(CHECKSUM(NEWID())) % 2); 
                DECLARE @k INT = 1;
                WHILE @k <= @SoCon
                BEGIN
                    DECLARE @GioiTinhCon NVARCHAR(10) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN N'Nam' ELSE N'Nữ' END;
                    DECLARE @TuoiMocCon INT = CASE WHEN @TuoiVC < @TuoiCH THEN @TuoiVC ELSE @TuoiCH END;
                    DECLARE @TuoiCon INT = @TuoiMocCon - (18 + (ABS(CHECKSUM(NEWID())) % 10)); 

                    IF @TuoiCon >= 0
                    BEGIN
                        DECLARE @HoCon NVARCHAR(20) = LEFT(@HoTenCH, CHARINDEX(' ', @HoTenCH) - 1);
                        DECLARE @HoTenCon NVARCHAR(100);
                        IF @GioiTinhCon = N'Nam' SELECT TOP 1 @HoTenCon = @HoCon + ' ' + D.Val + ' ' + T.Val FROM @DemNam D, @TenNam T ORDER BY NEWID();
                        ELSE SELECT TOP 1 @HoTenCon = @HoCon + ' ' + D.Val + ' ' + T.Val FROM @DemNu D, @TenNu T ORDER BY NEWID();

                        DECLARE @NgheCon NVARCHAR(100) = CASE WHEN @TuoiCon < 18 THEN N'Học sinh' ELSE N'Sinh viên' END;
                        DECLARE @CCCD_Con VARCHAR(20) = CASE WHEN @TuoiCon > 14 THEN CAST(100000000 + @GlobalNK AS VARCHAR) ELSE NULL END;
                        DECLARE @MaNK_Con VARCHAR(20) = 'NK' + RIGHT('00000' + CAST(@GlobalNK AS VARCHAR), 5); SET @GlobalNK = @GlobalNK + 1;

                        INSERT INTO nhan_khau (MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, NoiSinh, QuanHeVoiChuHo)
                        VALUES (@MaNK_Con, @MaHoKhau, @HoTenCon, @GioiTinhCon, DATEADD(YEAR, -@TuoiCon, GETDATE()), N'Kinh', N'Không', N'Việt Nam', @NgheCon, @CCCD_Con, @NoiSinhCH, N'Con');
                    END
                    SET @k = @k + 1;
                END
            END
        END

        -- E. Tạo Cha/Mẹ (20%)
        IF (ABS(CHECKSUM(NEWID())) % 100) < 20
        BEGIN
            DECLARE @VaiVes NVARCHAR(50) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN N'Cha' ELSE N'Mẹ' END;
            DECLARE @GioiTinhCM NVARCHAR(10) = CASE WHEN @VaiVes = N'Cha' THEN N'Nam' ELSE N'Nữ' END;
            DECLARE @TuoiCM INT = @TuoiCH + 18 + (ABS(CHECKSUM(NEWID())) % 15);
            
            DECLARE @HoTenCM NVARCHAR(100);
            IF @GioiTinhCM = N'Nam' SELECT TOP 1 @HoTenCM = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNam D, @TenNam T ORDER BY NEWID();
            ELSE SELECT TOP 1 @HoTenCM = H.Val + ' ' + D.Val + ' ' + T.Val FROM @Ho H, @DemNu D, @TenNu T ORDER BY NEWID();

            DECLARE @CCCD_CM VARCHAR(20) = CAST(100000000 + @GlobalNK AS VARCHAR);
            DECLARE @MaNK_CM VARCHAR(20) = 'NK' + RIGHT('00000' + CAST(@GlobalNK AS VARCHAR), 5); SET @GlobalNK = @GlobalNK + 1;

            INSERT INTO nhan_khau (MaNhanKhau, MaHoKhau, HoTen, GioiTinh, NgaySinh, DanToc, TonGiao, QuocTich, NgheNghiep, SoCCCD, NoiSinh, QuanHeVoiChuHo)
            VALUES (@MaNK_CM, @MaHoKhau, @HoTenCM, @GioiTinhCM, DATEADD(YEAR, -@TuoiCM, GETDATE()), N'Kinh', N'Không', N'Việt Nam', N'Về hưu', @CCCD_CM, @NoiSinhCH, @VaiVes);
        END
        
        -- F. Thu Phí
        INSERT INTO thu_phi (MaHoKhau, MaLoaiPhi, Thang, Nam, SoLuong, DonGia, ThanhTien, DaDong, HinhThuc)
        VALUES (@MaHoKhau, 'PQL', MONTH(GETDATE()), YEAR(GETDATE()), @DienTich, 6000, @DienTich * 6000, 0, NULL);

        SET @Phong = @Phong + 1;
    END
    SET @Tang = @Tang + 1;
END

-- ==================================================================================
-- 4. TẠO TẠM TRÚ & TẠM VẮNG (DỰA TRÊN DỮ LIỆU ĐÃ CÓ)
-- ==================================================================================
PRINT N'Đang sinh dữ liệu Tạm Trú / Tạm Vắng...';

-- 4.1 TẠM TRÚ: Lấy ngẫu nhiên 10 người ĐÃ CÓ trong các hộ khẩu để làm tạm trú
-- (Logic: Người thân, họ hàng đã nhập vào hộ khẩu nhưng diện tạm trú)
INSERT INTO tam_tru (MaNhanKhau, TuNgay, DenNgay, LyDo)
SELECT TOP 10 MaNhanKhau, GETDATE(), DATEADD(MONTH, 6, GETDATE()), N'Ở nhờ nhà người thân'
FROM nhan_khau 
WHERE QuanHeVoiChuHo <> N'Chủ hộ' -- Thường chủ hộ là thường trú, lấy thành viên khác làm tạm trú
ORDER BY NEWID();

-- 4.2 TẠM VẮNG: Lấy ngẫu nhiên 5 người khác (tránh trùng người tạm trú ở trên nếu có thể)
-- Logic: Lấy những người chưa có trong bảng tam_tru
INSERT INTO tam_vang (MaNhanKhau, NgayDi, NgayVe, LyDo)
SELECT TOP 5 MaNhanKhau, GETDATE(), DATEADD(MONTH, 3, GETDATE()), N'Đi học quân sự'
FROM nhan_khau 
WHERE MaNhanKhau NOT IN (SELECT MaNhanKhau FROM tam_tru) -- Đảm bảo 1 người không vừa tạm trú vừa tạm vắng
ORDER BY NEWID();

PRINT N'=== THÀNH CÔNG: Tạm trú chỉ lấy người có trong hộ khẩu! ===';
GO