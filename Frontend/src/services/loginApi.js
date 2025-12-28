// src/services/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/login';

export const loginUser = (credentials) => {
    // credentials sẽ là { tenDangNhap: '...', matKhau: '...' }
    return axios.post(`${API_URL}/login`, credentials);
};