import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import Users from "../../config/models/users.js";
dotenv.config();


const auth = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ status: 401, message: "token required" });
            return;
        }

        let decodeToken = jwt.verify(token, process.env.SECRET_WORD);
        req.userId = decodeToken._id;

        const user = await Users.findById(decodeToken._id);
        if (!user) {
            return res.status(401).json({ status: 401, message: "token invalid or expaired" });
        }

        req.role = user.role;
        req._id = user._id;
        req.email = user.email;
        req.name = user.name;
        next();

    } catch (error) {
        res.status(401).json({ status: 401, message: "token invalid or expaired" });
    }
};

export default auth;