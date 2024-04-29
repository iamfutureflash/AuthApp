const jwt = require("jsonwebtoken")
require("dotenv").config();
// auth, is Students, isAdmin
exports.auth = (req, res, next) => {
    try {
        // const { token } = req.body;
        const token = req?.header("Authorization")?.replace("Bearer ", "");
        // const token = req.cookies.token;
        // const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        // try {
        //     console.log("req header header--> ", req.header());

        // }
        // catch (e) {
        //     console.log('error in getting token---> ', e.message);
        // }
        // console.log("req header Authorization--> ", req.header("Authorization"));
        // console.log("req header normal--> ", req.header("Authorization"));
        // console.log("req header split--> ", req.header("Authorization").split(" ")[1]);
        // console.log("req header replace--> ", req.header("Authorization").replace("Bearer ", ""));
        // console.log("token--> ", token);

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'token missing'
            });
        }

        if (token) {
            try {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decode);
                console.log("req.user--> ", req.user);
                req.user = decode;
                console.log("req.user--> ", req.user);
                next();
            } catch (e) {
                return res.status(401).json({
                    success: false,
                    message: 'token is invalid or token is expired',
                    error:e
                })
            }
        }
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: 'something went wrong, while verifying the token',
            error: e
        })
    }
}

exports.isStudents = (req, res, next) => {
    try {
        // const { user: { id, email, role, iat, exp } } = req;
        const { user: { role } } = req;
        // console.log("new req-->", user);
        if (role === "Student") {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "this is protected route for students"
            })
        }
    } catch (e) {
        return res.status(401).json({
            success: false,
            message: "something went wrong, while verifying the student route",
            error: e
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        // const { user: { id, email, role, iat, exp } } = req;
        const { user: { role } } = req;
        // console.log("new req-->", user);
        if (role === "Admin") {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: "this is protected route for admin"
            })
        }
    }
    catch (e) {
        console.error(e);
        return res.status(401).json({
            success: false,
            message: "something went wrong, while verifying admin route",
            error: e,
        })
    }
}
