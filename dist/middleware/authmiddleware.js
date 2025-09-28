"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const AuthMiddleware = async (req, res, next) => {
    const headertoken = req.headers.authorization;
    console.log(headertoken);
    try {
        if (!headertoken) {
            return res.status(403).json({ message: "Header token is missing" });
        }
        const decoded = jsonwebtoken_1.default.verify(headertoken, JWT_SECRET);
        if (typeof decoded === "string") {
            return res.status(401).json({ message: "Invalid token format." });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authmiddleware.js.map