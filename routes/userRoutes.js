const express = require("express");
const { login, signup } = require("../controller/Auth");
const { auth, isAdmin, isStudents } = require("../middlewares/AuthMiddlewares");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/students", auth, isStudents, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Protected Route fro Students',
    })
});

module.exports = router;