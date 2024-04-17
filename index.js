const express = require('express');
const { connectDB } = require('./config/database');
const user = require("./routes/user")
require('dotenv').config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json())
app.use("/api/v1", user)


app.listen(PORT, () => {
    console.log(`server is started at port ${PORT}`);
})

connectDB();