const jwt = require('jsonwebtoken');
const CreateUser = require('../Schema/User');
const FetchUser = async (req, res, next) => {
    const header = req.header("token");
    if (!header) {
        return res.status(400).json({
            error: {
                error_type: "Header not included",
                error_msg: "Unauthorized action",
                status_code: 400
            }
        })
    }
    const decoded = jwt.verify(header, process.env.private);
    const find_user = await CreateUser.findById(decoded);
    user = find_user;
    next();
}

module.exports = FetchUser