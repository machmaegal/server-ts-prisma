"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleErrors = (app) => {
    app.use((req, res, next) => {
        res.status(404).json({ message: "This route does not exist" });
    });
    app.use((err, req, res, next) => {
        // handle next(err) calls
        console.error("ERROR", req.method, req.path, err);
        // only render if error ocurred before sending response
        if (!res.headersSent) {
            res
                .status(500)
                .json({
                message: "Internal server error. Check the server console",
            });
        }
    });
};
exports.default = handleErrors;
