// public/script.js

const API_BASE_URL = 'http://localhost:3000';

// Hàm chung để gọi API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi fetch dữ liệu từ ${endpoint}:`, error);
        return null; 
    }
}

// 1. Hiển thị thống kê chung (Count)
async function displayCounts() {
    const hoKhauData = await fetchData('hokhau');
    const nhanKhauData = await fetchData('nhankhau'); // Đảm bảo đã có API /nhankhau

    if (hoKhauData) {
        document.getElementById('hoKhauCount').textContent = hoKhauData.length;
    }
    if (nhanKhauData) {
        document.getElementById('nhanKhauCount').textContent = nhanKhauData.length;
    }
}

// 2. Hiển thị danh sách Hộ Khẩu
async function displayHoKhauTable() {
    const hoKhauData = await fetchData('hokhau');
    const tableBody = document.getElementById('hoKhauTableBody');
    tableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (hoKhauData && hoKhauData.length > 0) {
        hoKhauData.forEach(hoKhau => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = hoKhau.ID;
            row.insertCell().textContent = hoKhau.MaHo;
            row.insertCell().textContent = hoKhau.ChuHo;
            row.insertCell().textContent = hoKhau.DiaChi;
        });
    } else {
        const row = tableBody.insertRow();
        row.insertCell(0).colSpan = 4;
        row.cells[0].textContent = "Không có dữ liệu Hộ Khẩu nào.";
    }
}

// Chạy các hàm khi trang web được tải
document.addEventListener('DOMContentLoaded', () => {
    displayCounts();
    displayHoKhauTable();
});