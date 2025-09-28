import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client";

const client  = new PrismaClient();

export const getBalance = async(req:Request, res: Response) => {
    try {
        const user = (req as any).user;
        const fromuserId = user.id

        const account = await client.bank.findUnique({
            where: { userId: fromuserId }
        })

        if (!account){
            return res.status(404).json({ message : "Account not found"})
        }

        return res.status(200).json({ balance: account.balance / 100 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error" });
    }
}


export const transferFunds = async(req: Request, res: Response) => {

   
    try {
        const user = (req as any).user;
        const fromuserId = user.id;

        const { toUserId, amount } = req.body;
        if (!toUserId || !amount) {
            return res.status(400).json({ message: "Reciever account not found"})
        }
        const amountInpaise = Math.round(amount * 1000)

        const results = await client.$transaction(async(tx) => {
            const fromAccount = await tx.bank.findUnique({
                where : { userId :fromuserId},
                
            })
            if (!fromAccount) throw new Error("Sender Account Not Found")

            if (fromAccount.balance < amountInpaise){
                throw new Error("Insufficient funds")
            }


            
            const toAccount = await tx.bank.findUnique({
                where: {userId: toUserId}
            })

            if (!toAccount) throw new Error("Receiver account not found");

            
        
            await tx.bank.update({
                where: {userId: fromuserId},
                data: {balance: {decrement: amountInpaise}}
            })

            await tx.bank.update({
                where: {userId: toUserId},
                data: {balance: {increment: amountInpaise}}
            })

            return { message: "Transfer successful" };

        })

       return res.status(200).json(results);
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message:  "Transfer failed" })     
    }

}





