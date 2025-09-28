import {  Router } from "express"
import { bulkSearchUsers, singin, singup, updateUser } from "../controller/Authcontroller"
import { AuthMiddleware } from "../middleware/authmiddleware";
import { getBalance, transferFunds } from "../controller/Bankcontroller";



const router = Router()


router.post('/signup',singup);
router.post('/signin',singin);

router.post('/update',AuthMiddleware,updateUser);

router.get('/user/bulk',AuthMiddleware,bulkSearchUsers)
router.get('/balance',AuthMiddleware,getBalance)
router.post('/transfer',AuthMiddleware,transferFunds)

export default router;