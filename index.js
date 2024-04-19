const express = require('express');
const { connectDB } = require('./config/database');
const user = require("./routes/userRoutes")
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json())
app.use("/api/v1", user)


app.listen(PORT, () => {
    console.log(`server is started at port ${PORT}`);
})
app.get('/', (req, res) => {
    res.send('<h1>this is homepage for blog app backend</h1>')
})
connectDB();