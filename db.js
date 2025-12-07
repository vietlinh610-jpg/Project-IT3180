const sql = require("mssql");

const config = {
    user: "daoquocdai",            // để trống vì bạn dùng Windows Auth
    password: "18012005",
    server: "LAPTOP-RBPUJCOC\\SQLEXPRESS01",
    database: "QuanLyDanCu",
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

async function getPool() {
    const pool = await sql.connect(config);
    return pool;
}

module.exports = { sql, getPool };
