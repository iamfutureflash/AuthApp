const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const hashPasswordWithRetry = async (password, rounds, maxRetries) => {
    let hashedPassword;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            hashedPassword = await bcrypt.hash(password, rounds);
            return hashedPassword;
        } catch (error) {
            retries++;
            console.error(`Error hashing password (Attempt ${retries}): ${error.message})`);
            // You can add additional logging or delay logic here if needed
        }
    }

    return res.status(400).json({
        success: false,
        message: `Failed to hash password after ${maxRetries} attempts`,
    })
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exixtingUser = await userModel.findOne({ email });
        if (exixtingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            })
        }
        const hashedPassword = await hashPasswordWithRetry(password, 10, 3);

        const user = await userModel.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({
            success: true,
            message: 'User Created Successfully',
        })

    }
    catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            message: 'User cannot be registered, please try again later',
        })
    }
}




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(406).json({
                success: false,
                message: `Please fill all the details carefully`,
            })
        }
        const user = await userModel.findOne({ email });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const payload = {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                }
                const JWT_SECRET = process.env.JWT_SECRET || 'puneet';
                let token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });


                user.password = undefined;

                const options = {
                    expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
                    httpOnly: true,
                }

                return res.cookie("token", token, options).status(200).json({
                    success: true,
                    token,
                    user: {
                        ...user?._doc,
                        token,
                    },
                    message: 'user logged in successfully',
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'password is incorrect',
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: 'user not exists',
            });
        }

    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: 'error in login process, please try after some time',
            error: e,
        });
    }
}

