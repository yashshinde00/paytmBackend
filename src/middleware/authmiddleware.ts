import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string
export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const headertoken = req.headers.authorization;
    console.log(headertoken)
    try {

        if (!headertoken){
            return res.status(403).json({message: "Header token is missing"})
        }
        const decoded = jwt.verify(headertoken,JWT_SECRET)

        if (typeof decoded === "string"){
            return res.status(401).json({ message: "Invalid token format." }); 
        }
        (req as any).user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
}