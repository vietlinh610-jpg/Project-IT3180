
-- =============================================
-- BƯỚC 1: DỌN DẸP DỮ LIỆU CŨ (Reset từ đầu)
-- =============================================
-- Tắt kiểm tra khóa ngoại để xóa cho dễ
ALTER TABLE quan_he NOCHECK CONSTRAINT ALL;
ALTER TABLE chu_ho NOCHECK CONSTRAINT ALL;
ALTER TABLE nhan_khau NOCHECK CONSTRAINT ALL;
ALTER TABLE ho_khau NOCHECK CONSTRAINT ALL;
ALTER TABLE nop_tien NOCHECK CONSTRAINT ALL;
ALTER TABLE tam_vang NOCHECK CONSTRAINT ALL;
ALTER TABLE tam_tru NOCHECK CONSTRAINT ALL;

-- Xóa dữ liệu các bảng
DELETE FROM tam_tru;
DELETE FROM tam_vang;
DELETE FROM nop_tien;
DELETE FROM quan_he;
DELETE FROM chu_ho;
DELETE FROM nhan_khau;
DELETE FROM ho_khau;
DELETE FROM khoan_thu;
DELETE FROM nguoi_dung;

-- Reset số thứ tự tự tăng (ID) về 1
DBCC CHECKIDENT ('ho_khau', RESEED, 0);
DBCC CHECKIDENT ('nhan_khau', RESEED, 0);
DBCC CHECKIDENT ('khoan_thu', RESEED, 0);
DBCC CHECKIDENT ('nop_tien', RESEED, 0);
DBCC CHECKIDENT ('nguoi_dung', RESEED, 0);
DBCC CHECKIDENT ('tam_vang', RESEED, 0);
DBCC CHECKIDENT ('tam_tru', RESEED, 0);

-- Bật lại kiểm tra khóa ngoại
ALTER TABLE quan_he CHECK CONSTRAINT ALL;
ALTER TABLE chu_ho CHECK CONSTRAINT ALL;
ALTER TABLE nhan_khau CHECK CONSTRAINT ALL;
ALTER TABLE ho_khau CHECK CONSTRAINT ALL;
ALTER TABLE nop_tien CHECK CONSTRAINT ALL;
ALTER TABLE tam_vang CHECK CONSTRAINT ALL;
ALTER TABLE tam_tru CHECK CONSTRAINT ALL;

PRINT N'✅ Đã xóa sạch dữ liệu cũ!';

-- =============================================
-- BƯỚC 2: TẠO DỮ LIỆU CỐ ĐỊNH (Admin & Khoản thu)
-- =============================================

-- 1. Tạo Admin
INSERT INTO nguoi_dung (Username, Passwd) VALUES ('admin', '123456');

-- 2. Tạo các khoản thu cơ bản
INSERT INTO khoan_thu (TenKhoanThu, SoTien, LoaiKhoanThu) VALUES 
(N'Phí dịch vụ chung cư T12/2025', 300000, 1), -- Loại 1: Bắt buộc
(N'Tiền điện T12/2025', 0, 1),                 -- Số tiền sẽ nhập theo thực tế
(N'Tiền nước T12/2025', 0, 1),
(N'Quyên góp quỹ vắc xin', 0, 0);              -- Loại 0: Tự nguyện

PRINT N'✅ Đã tạo Admin và Khoản thu!';

-- =============================================
-- BƯỚC 3: SINH DỮ LIỆU CĂN HỘ VÀ CƯ DÂN (Logic Phức tạp)
-- =============================================

-- Khai báo biến tạm để chạy vòng lặp
DECLARE @Tang INT = 1;
DECLARE @Phong INT = 1;
DECLARE @SoNguoi INT;
DECLARE @i INT;
DECLARE @MaHoMoi INT;
DECLARE @IDChuHo INT;
DECLARE @TenRandom NVARCHAR(50);
DECLARE @HoRandom NVARCHAR(20);
DECLARE @DemRandom NVARCHAR(20);
DECLARE @TenThat NVARCHAR(20);

-- Tạo bảng tạm chứa Họ, Đệm, Tên để ghép random
CREATE TABLE #Ho (Val NVARCHAR(20));
INSERT INTO #Ho VALUES (N'Nguyễn'), (N'Trần'), (N'Lê'), (N'Phạm'), (N'Hoàng'), (N'Huỳnh'), (N'Phan'), (N'Vũ'), (N'Võ'), (N'Đặng');

CREATE TABLE #Dem (Val NVARCHAR(20));
INSERT INTO #Dem VALUES (N'Văn'), (N'Thị'), (N'Hữu'), (N'Đức'), (N'Ngọc'), (N'Xuân'), (N'Thanh'), (N'Mạnh'), (N'Hải'), (N'Minh');

CREATE TABLE #Ten (Val NVARCHAR(20));
INSERT INTO #Ten VALUES (N'An'), (N'Bình'), (N'Cường'), (N'Dũng'), (N'Giang'), (N'Hương'), (N'Khánh'), (N'Lan'), (N'Minh'), (N'Nam'), (N'Oanh'), (N'Phúc'), (N'Quân'), (N'Sơn'), (N'Tú'), (N'Uyên'), (N'Vy'), (N'Yến');

-- === BẮT ĐẦU VÒNG LẶP TẠO 10 TẦNG ===
WHILE @Tang <= 10
BEGIN
    SET @Phong = 1;
    -- === VÒNG LẶP TẠO 10 PHÒNG MỖI TẦNG ===
    WHILE @Phong <= 10
    BEGIN
        -- Tên phòng: Ví dụ Tầng 1 phòng 1 -> P101, Tầng 10 phòng 5 -> P1005
        DECLARE @TenPhong NVARCHAR(20);
        IF @Tang < 10
            SET @TenPhong = N'Phòng ' + CAST(@Tang AS NVARCHAR) + N'0' + CAST(@Phong AS NVARCHAR);
        ELSE
            SET @TenPhong = N'Phòng ' + CAST(@Tang AS NVARCHAR) + N'0' + CAST(@Phong AS NVARCHAR); -- Tầng 10
            IF @Phong = 10 SET @TenPhong = N'Phòng ' + CAST(@Tang AS NVARCHAR) + N'10';

        -- Random xem phòng này có người ở không (Tỉ lệ 80% có người)
        -- ABS(CHECKSUM(NEWID())) % 10 lấy số ngẫu nhiên từ 0-9. Nếu < 8 thì tạo người.
        IF (ABS(CHECKSUM(NEWID())) % 10) < 8 
        BEGIN
            -- 1. Tạo Hộ khẩu
            INSERT INTO ho_khau (DiaChi, SoThanhVien) VALUES (@TenPhong, 0);
            SET @MaHoMoi = SCOPE_IDENTITY(); -- Lấy ID vừa tạo

            -- Random số thành viên trong hộ (Từ 1 đến 5 người)
            SET @SoNguoi = (ABS(CHECKSUM(NEWID())) % 5) + 1;
            SET @i = 1;

            -- Vòng lặp tạo từng thành viên
            WHILE @i <= @SoNguoi
            BEGIN
                -- Ghép tên ngẫu nhiên
                SELECT TOP 1 @HoRandom = Val FROM #Ho ORDER BY NEWID();
                SELECT TOP 1 @DemRandom = Val FROM #Dem ORDER BY NEWID();
                SELECT TOP 1 @TenThat = Val FROM #Ten ORDER BY NEWID();
                SET @TenRandom = @HoRandom + ' ' + @DemRandom + ' ' + @TenThat;

                -- Insert Nhân khẩu
                INSERT INTO nhan_khau (Ten, CMND, Tuoi, SDT, MaHo)
                VALUES (
                    @TenRandom, 
                    CAST(ABS(CHECKSUM(NEWID())) AS VARCHAR(20)), -- CMND ngẫu nhiên
                    (ABS(CHECKSUM(NEWID())) % 60) + 1,           -- Tuổi từ 1-60
                    '09' + CAST((ABS(CHECKSUM(NEWID())) % 89999999 + 10000000) AS VARCHAR), -- SĐT ngẫu nhiên
                    @MaHoMoi
                );

                -- Nếu là người đầu tiên thì chọn làm CHỦ HỘ
                IF @i = 1
                BEGIN
                    SET @IDChuHo = SCOPE_IDENTITY();
                    INSERT INTO chu_ho (MaHo, IDChuHo, Note) VALUES (@MaHoMoi, @IDChuHo, N'Chủ hộ');
                END
                ELSE
                BEGIN
                    -- Các người sau là thành viên
                    INSERT INTO quan_he (MaHo, IDThanhVien, QuanHe) VALUES (@MaHoMoi, SCOPE_IDENTITY(), N'Thành viên');
                END

                SET @i = @i + 1;
            END

            -- Cập nhật lại số thành viên chuẩn cho bảng Hộ khẩu
            UPDATE ho_khau SET SoThanhVien = @SoNguoi WHERE MaHo = @MaHoMoi;

            -- 2. Random tạo dữ liệu đóng tiền (50% hộ đã đóng tiền phí dịch vụ - Mã 1)
            IF (ABS(CHECKSUM(NEWID())) % 2) = 0
            BEGIN
                INSERT INTO nop_tien (MaKhoanThu, IDThanhVien, NgayThu) 
                VALUES (1, @IDChuHo, DATEADD(day, - (ABS(CHECKSUM(NEWID())) % 30), GETDATE()));
            END
        END
        
        SET @Phong = @Phong + 1;
    END
    SET @Tang = @Tang + 1;
END

-- Xóa bảng tạm
DROP TABLE #Ho;
DROP TABLE #Dem;
DROP TABLE #Ten;

PRINT N'✅ Đã tạo xong 100 căn hộ với dữ liệu dân cư ngẫu nhiên!';

-- =============================================
-- BƯỚC 4: TẠO VÀI DỮ LIỆU TẠM TRÚ / TẠM VẮNG (Để test bảng mới)
-- =============================================

-- Lấy ngẫu nhiên 2 người để cho đi Tạm vắng
INSERT INTO tam_vang (HoTen, SoCCCD, MaHoKhau, NgayDi, NgayVeDuKien, LyDo, TrangThai)
SELECT TOP 2 Ten, CMND, MaHo, GETDATE(), DATEADD(day, 30, GETDATE()), N'Đi công tác xa', N'Đã duyệt'
FROM nhan_khau
ORDER BY NEWID();

-- Tạo ngẫu nhiên 2 người Tạm trú (Lấy đại ID từ danh sách hộ để làm địa chỉ đến)
INSERT INTO tam_tru (HoTen, SoCCCD, MaCanHo, NgayBatDau, NgayKetThuc, LyDo, TrangThai)
SELECT TOP 2 N'Nguyễn Văn Khách ' + CAST(MaHo AS NVARCHAR), '00120202020', MaHo, GETDATE(), DATEADD(month, 3, GETDATE()), N'Sinh viên thuê trọ', N'Chờ duyệt'
FROM ho_khau
ORDER BY NEWID();

PRINT N'✅ Đã tạo thêm dữ liệu Tạm trú / Tạm vắng!';
PRINT N'🎉 HOÀN TẤT! HỆ THỐNG ĐÃ SẴN SÀNG.';