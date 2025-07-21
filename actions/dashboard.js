"use server";
import { db } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server"
import { Select } from "@radix-ui/react-select";
import { revalidatePath } from "next/cache";
import { _includes } from "zod/v4/core";

const serializeTransaction =(obj) =>{
    const serialized = {...obj };

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

     if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
};
export async function createAccount(data) {
try {
    const {userId} = await  auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where:{clerkUserId:userId},
    })

    if(!user){
        throw new Error("User Not Found");
    }

    //balance assignment from float value
    const balanceFloat = parseFloat(data.balance)
    if(isNaN(balanceFloat)){
        throw new Error("invalid balance amount")
    }

    //need to check wether user creating forst account if yes it will be the default account
    const existingAccount = await db.account.findMany({
        where :{userId:user.id},
    });
    
    //default account check 
    const shouldBeDefault = existingAccount.length === 0?true:data.isDefault;

    //making a single account default 
    if(shouldBeDefault){
        await db.account.updateMany({
            where:{userId:user.id,isDefault:true},
            data:{isDefault:false}
        })

    }
    const account = await db.account.create({
        data:{
            ...data,
            balance:balanceFloat,
            userId:user.id,
            isDefault:shouldBeDefault,
        }
    })
    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard")
    return {success:true , data:serializedAccount}; 
    
} catch (error) {
    
}
    
}

export async function getUserAccount(){
    const {userId} = await  auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where:{clerkUserId:userId},
    })

    if(!user){
        throw new Error("User Not Found");
    }

    if(!user){
        throw new Error("User not found ")
    }
    const accounts = await db.account.findMany({
        where:{userId:user.id},
        orderBy:{createdAt:"desc"},
        include:{
            _count:{
                select:{
                    transactions:true,
                },
            },
        },
    });
    const serializedAccount = accounts.map(serializeTransaction);
    return serializedAccount;
    
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}