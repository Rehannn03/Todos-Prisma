"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_1 = require("process");
const userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
function generateToken(user) {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username
    }, process_1.env.JWT_SECRET, {
        expiresIn: process_1.env.JWT_EXPIRY
    });
}
userRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.create({
        data: {
            username,
            password
        }
    });
    res.status(200).json(user);
}));
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            username,
            password
        }
    });
    if (password != (user === null || user === void 0 ? void 0 : user.password)) {
        res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user) {
        res.status(404).json({ message: "User not found" });
    }
    const token = generateToken(user);
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    };
    res.status(200).json({
        message: "Login successful",
        user
    })
        .cookie('token', token, options);
}));
exports.default = userRouter;
