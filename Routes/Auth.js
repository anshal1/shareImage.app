const express = require("express");
const CreateUser = require("../Schema/User");
const router = express.Router();
const bc = require("bcryptjs");
const jwt = require('jsonwebtoken');
const time = require("timeago.js");
const { format } = time;
require("dotenv").config()


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                error: {
                    error_type: "Empty Fields",
                    error_msg: "Fields are required",
                    status_code: 400
                }
            });
        }
        const find_user = await CreateUser.findOne({ username });
        if (!find_user) {
            return res.status(404).json({
                error: {
                    error_type: "User not found",
                    error_msg: "User Not Found",
                    status_code: 404
                }
            })
        }
        const compare = bc.compareSync(password, find_user.password);
        if (!compare) {
            return res.status(400).json({
                error: {
                    error_type: "Wrong Password",
                    error_msg: "Invalid Password",
                    status_code: 400
                }
            })
        }
        const token = jwt.sign({ _id: find_user._id }, process.env.private);
        res.json({
            token: token,
            username: find_user.username,
            login_at: format(Date.now())
        })
    } catch (error) {
        console.log(error);
        if (error) {
            return res.status(500).json({
                error: {
                    error_type: "Internal Error",
                    error_msg: "Internal server error",
                    status_code: 500
                }
            })
        }
    }
})
router.post("/signup", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({
                error: {
                    error_type: "Empty Fields",
                    error_msg: "Fields are required",
                    status_code: 400
                }
            });
        }
        const find_user = await CreateUser.findOne({ username: username});
        const find_user2 = await CreateUser.findOne({ email: email});
        if (find_user || find_user2) {
            return res.status(400).json({
                error: {
                    error_type: "user exists",
                    error_msg: "User already exists",
                    status_code: 400
                }
            })
        }
        const salt = bc.genSaltSync(10);
        const salted_password = bc.hashSync(password, salt);
        const Newuser = await CreateUser.create({
            username,
            email,
            password: salted_password
        })
        const token = jwt.sign({ _id: Newuser._id }, process.env.private);
        res.json({
            token: token,
            username: Newuser.username,
            login_at: format(Date.now())
        })
    } catch (error) {
        if (error) {
            return res.status(500).json({
                error: {
                    error_type: "Internal Error",
                    error_msg: "Internal server error",
                    status_code: 500
                }
            })
        }
    }
})
router.post("/user", async (req, res) => {
    const header = req.header("token");
    const decoded = jwt.verify(header, process.env.private);
    if (!header) {
        return res.status(404).json({
            error: {
                error_type: "Invalid token",
                error_msg: "Unauthorized action",
                status_code: 401
            }
        })
    }
    const find_user = await CreateUser.findById(decoded);
    res.json({
        user: find_user,
        requested_at: format(Date.now())
    })
})

module.exports = router;