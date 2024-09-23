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
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Use .env
/**
 * Registers a new user.
 *
 * @param req - Express request object containing the user's email and password in the body.
 * @param res - Express response object used to send the response.
 *
 * @returns A 201 response with a JWT token and user data if registration is successful.
 *          A 400 response if the user already exists.
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield prisma.user.findUnique({ where: { email } });
    if (existingUser)
        return res.status(400).json({ error: 'User already exists' });
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield prisma.user.create({ data: { email, password: hashedPassword } });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
});
exports.register = register;
/**
 * Logs in an existing user.
 *
 * @param req - Express request object containing the user's email and password in the body.
 * @param res - Express response object used to send the response.
 *
 * @returns A 200 response with a JWT token and user data if login is successful.
 *          A 401 response if the email or password is incorrect.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const validPassword = yield bcryptjs_1.default.compare(password, user.password);
    if (!validPassword)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
});
exports.login = login;
