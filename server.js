const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

app.get("/test", (req, res) => {
    res.send("NodeJS Server is running and responding!");
});

const hoKhauRoutes = require("./routes/hokhau");
const nhanKhauRoutes = require("./routes/nhankhau");
const khoanThuRoutes = require("./routes/khoanthu");
const thuPhiRoutes = require("./routes/thuphi");
app.use("/hokhau", hoKhauRoutes);
app.use("/nhankhau", nhanKhauRoutes);
app.use("/khoanthu", khoanThuRoutes);
app.use("/thuphi", thuPhiRoutes);