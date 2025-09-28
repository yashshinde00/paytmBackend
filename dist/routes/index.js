"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authcontroller_1 = require("../controller/Authcontroller");
const authmiddleware_1 = require("../middleware/authmiddleware");
const Bankcontroller_1 = require("../controller/Bankcontroller");
const router = (0, express_1.Router)();
router.post('/signup', Authcontroller_1.singup);
router.post('/signin', Authcontroller_1.singin);
router.post('/update', authmiddleware_1.AuthMiddleware, Authcontroller_1.updateUser);
router.get('/user/bulk', authmiddleware_1.AuthMiddleware, Authcontroller_1.bulkSearchUsers);
router.get('/balance', authmiddleware_1.AuthMiddleware, Bankcontroller_1.getBalance);
router.post('/transfer', authmiddleware_1.AuthMiddleware, Bankcontroller_1.transferFunds);
exports.default = router;
//# sourceMappingURL=index.js.map