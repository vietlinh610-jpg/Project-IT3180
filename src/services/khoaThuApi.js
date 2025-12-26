import axios from 'axios';

const API_URL = 'http://localhost:5000/api/khoan-thu';

export const layKhoanThu = () => axios.get(`${API_URL}`);
export const taoKhoanThu = (data) => axios.post(`${API_URL}`, data);