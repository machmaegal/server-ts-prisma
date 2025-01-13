"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./config/index"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const foodItem_routes_1 = __importDefault(require("./routes/foodItem.routes"));
const error_handling_1 = __importDefault(require("./error-handling"));
// access .env
dotenv_1.default.config();
// Handle http requests 
const app = (0, express_1.default)();
// middleware
(0, index_1.default)(app);
// handle routes 
app.use('/', index_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/ingredients', foodItem_routes_1.default);
(0, error_handling_1.default)(app);
exports.default = app;
