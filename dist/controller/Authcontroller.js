"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkSearchUsers = exports.updateUser = exports.singin = exports.singup = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const client = new client_1.PrismaClient();
const singup = async (req, res) => {
    const { firstName, email, password, lastName } = req.body;
    try {
        const existingUser = await client.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(401).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await client.users.create({
            data: { firstName, email, password: hashedPassword, lastName },
        });
        const initialBalance = Math.floor(Math.random() * (10000 - 100 + 1) + 100);
        await client.bank.create({
            data: { userId: newUser.id, balance: initialBalance * 100 },
        });
        return res.status(201).json({
            message: "User successfully registered",
            user: newUser,
            initialBalance
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal error" });
    }
};
exports.singup = singup;
const singin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await client.users.findUnique({ where: { email } });
        if (!existingUser) {
            return res.status(403).json({ message: "User is not registered" });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "credentials  are not right" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: existingUser.id }, JWT_SECRET);
        return res.status(200).json({ message: "Login successful", user: existingUser, accessToken });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
};
exports.singin = singin;
const updateUser = async (req, res) => {
    try {
        const user = req.user;
        const userId = user.id;
        const { firstName, lastName, password } = req.body;
        let updatedData = {
            firstName,
            lastName,
        };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedData.password = hashedPassword;
        }
        const updatedUser = await client.users.update({
            where: { id: userId },
            data: updatedData,
        });
        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
};
exports.updateUser = updateUser;
const bulkSearchUsers = async (req, res) => {
    try {
        const filter = req.query.filter;
        const findPerson = await client.users.findMany({
            where: filter ? {
                OR: [
                    {
                        firstName: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                            mode: "insensitive"
                        }
                    }
                ],
            } : {}
        });
        return res.status(200).json({ findPerson });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
};
exports.bulkSearchUsers = bulkSearchUsers;
//# sourceMappingURL=Authcontroller.js.map