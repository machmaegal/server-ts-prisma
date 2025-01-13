"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //access to req.body
const morgan_1 = __importDefault(require("morgan")); //logging tool
const cookie_parser_1 = __importDefault(require("cookie-parser")); //handle cookies / authentication
const cors_1 = __importDefault(require("cors"));
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";
//middleware
const configureApp = (app) => {
    app.set('trust proxy', 1); //needed for hosting on webservice platform
    app.use((0, cors_1.default)({
        origin: [FRONTEND_URL] //trusted urls inside
    }));
    //app logs in dev environment
    app.use((0, morgan_1.default)('dev'));
    //access to req.body
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
};
exports.default = configureApp;
