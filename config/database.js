const mongoose = require('mongoose');
require('dotenv').config();
exports.connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => { console.log('DB connected successfully'); })
        .catch((e) => {
            console.log('DB connection error');
            console.error(e);
            process.exit(1);
        });
}