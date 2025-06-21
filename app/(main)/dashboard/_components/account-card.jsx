'use client'

import { updateDefaultAccount, deleteAccount } from '@/actions/account';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useTransition } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AccountCard = ({account}) => {
    const {name,type,balance,id,isDefault} = account;

    const {
      loading:updateDefaultLoading,
      fn:updateDefaultFn,
      data:updatedAccount,
      error,
    } = useFetch(updateDefaultAccount)

    const [isPending, startTransition] = useTransition();

    const handleDefaultChange = async (event) =>{
      event.preventDefault();
      if (isDefault){
        toast.warning("you need atleast one default account");
        return;
      }
      await updateDefaultFn(id)
    }

    const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this account?")) {
        startTransition(async () => {
          await deleteAccount(account.id);
          // Optionally, show a toast or refresh the list
        });
      }
    };

    useEffect(()=>{
      if (updatedAccount?.success){
        toast.success("Default account updated successfully")
      }
    },[updatedAccount,updateDefaultLoading])

     useEffect(()=>{
      if (error){
        toast.error(error.message ||"Failed to update the default account")
      }
    },[error])
  return (
   <Card className="hover:shadow-xl/30 transition-shadow group relative">
    <Link href ={`/account/${id}`}>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
    <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading}/>
  </CardHeader>
  <CardContent>
   <div className='text-2xl font-bold'>₹{parseFloat(balance).toFixed(2)}</div>
   <p className='text-xs text-muted-foreground capitalize'>{type.charAt(0)+type.slice(1).toLowerCase()} Account</p>
  </CardContent>
  <CardFooter className="flex justify-between text-sm text-muted-foreground">
     <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
  </CardFooter>
  </Link>
  {/* <div className="flex justify-end pr-10">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div> */}
</Card>
  )
}

export default AccountCard