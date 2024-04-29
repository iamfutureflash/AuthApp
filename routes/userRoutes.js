const express = require("express");
const { login, signup } = require("../controller/Auth");
const { auth, isAdmin, isStudents } = require("../middlewares/AuthMiddlewares");
const userModel = require("../model/userModel");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/students", auth, isStudents, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Protected Route for Students',
    })
});

router.get("/test", auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the Protected Route for test user',
    })
});
router.get("/profile", auth, async (req, res) => {
    try {
        const id = req.user.id;
        const getUser = await userModel.findById(id)
        getUser.password = undefined;
        res.status(200).json({
            success: true,
            profile: getUser,
            message: 'Welcome to the Protected Route for test user',
        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: 'error while getting profile',
            error: e.message
        })
    }
});
module.exports = router;