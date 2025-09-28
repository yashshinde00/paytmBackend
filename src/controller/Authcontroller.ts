import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;

const client = new PrismaClient()
export const singup = async(req: Request, res: Response) => {
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

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal error" });
    }
}


 export const singin = async(req:Request, res: Response) => {
        const { email,password } = req.body;
        try {
            const existingUser = await client.users.findUnique({ where: {email}})
            if (!existingUser){
                return res.status(403).json({message: "User is not registered"})
            }
            const  isMatch  = await bcrypt.compare(password,existingUser.password)
            if (!isMatch){
                return res.status(401).json({message: "credentials  are not right"})
            }
            const accessToken =  jwt.sign({id: existingUser.id}, JWT_SECRET)

            return res.status(200).json({ message: "Login successful", user: existingUser, accessToken });

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Internal Error"})
        }
    }



    export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; 
    const userId = user.id;

    const { firstName, lastName, password } = req.body;

    let updatedData: any = {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};


export const  bulkSearchUsers = async (req: Request, res: Response) =>{
    try {
       const filter =  req.query.filter as string | undefined;
       
       
       const findPerson = await client.users.findMany({
        where: filter ?{
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
        }:{}
       })
       return res.status(200).json({ findPerson });
    
    } catch (error) {
         console.error(error);
         return res.status(500).json({ message: "Internal error" });
    }
}