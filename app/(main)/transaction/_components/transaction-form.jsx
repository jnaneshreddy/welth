"use client"

import { createTransaction, updateTransaction } from '@/actions/transaction';
import { transactionSchema } from '@/app/lib/schema'
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/use-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {CalendarIcon, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import ReciptScanner from './recipt-scanner';


const AddTransactionForm = ({accounts,categories,editMode = false,initialData = null,}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit")
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm ({
    resolver: zodResolver(transactionSchema),
    defaultValues:editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }:{
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
  });

  const {
    loading:transactionLoading,
    fn:transactionFn,
    data:transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
    console.log("Raw form data:", data);
    console.log("Category value:", data.category);
    console.log("Category type:", typeof data.category);
    
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    
    console.log("Processed form data:", formData);

     if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult && !transactionLoading) {
      if (transactionResult.success) {
        toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );

        reset();
        router.push(`/account/${transactionResult.data.accountId}`);
      } else {
        toast.error(transactionResult.error || "Failed to create transaction");
      }
    }
  }, [transactionResult, transactionLoading, reset, router,editMode])

  const handleScanComplete = (scannedData) => {
    console.log(scannedData);
    if(scannedData){
      setValue("amount",scannedData.amount.toString ());
      setValue("date",new Date(scannedData.date));
      if (scannedData.description){
        setValue("description",scannedData.description);
      }
      if (scannedData.category){
        setValue("category",scannedData.category)
      }
      
    }
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
      {/* AI RECIPT SCANNER */}
      {!editMode && <ReciptScanner onScanComplete={handleScanComplete} />}
      {/* TYPE */}
      <div className='space-y-3'>
        <label className='text-sm font-medium'>Type</label>
        <Select onValueChange = {(value) => setValue("type",value)}
          defaultValue = {type}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className='text-sm text-red-500'>{errors.type.message}</p>
        )}
      </div>

      {/* AMOUNT & ACCOUNT */}
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}/>
          {/* ✅ Fixed: Changed errors.type to errors.amount */}
          {errors.amount && (
            <p className='text-sm text-red-500'>{errors.amount.message}</p>
          )}
        </div>
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Account</label>
          <Select onValueChange = {(value) => setValue("accountId",value)}
            defaultValue = {getValues("accountId")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account)=>(
                <SelectItem key={account.id} value={account.id}>
                  {account.name}(₹{parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button variant='ghost'
                  className="w-full select-none items-center text-sm outline-none">
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className='text-sm text-red-500'>{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* CATEGORY */}
      <div className='space-y-3'>
        <label className='text-sm font-medium'>Category</label>
        <Select onValueChange = {(value) => setValue("category",value)}
          defaultValue = {getValues("category")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category)=>(
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className='text-sm text-red-500'>{errors.category.message}</p>
        )}
      </div>

      {/* DATE */}
      <div className='space-y-3'>
        <label className='text-sm font-medium'>Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" 
              className="w-full text-left font-normal">
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50'/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align='start'>
            <Calendar mode="single" selected={date}
              onSelect={(date) => setValue("date",date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01") // ✅ Fixed
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className='text-sm text-red-500'>{errors.date.message}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className='space-y-3'>
        <label className='text-sm font-medium'>Description</label>
        <Input placeholder="Enter the description" {...register("description")} />
        {errors.description && (
          <p className='text-sm text-red-500'>{errors.description.message}</p>
        )}
      </div>

      {/* IS RECURRING */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <label
            htmlFor="isDefault"
            className="text-base font-medium cursor-pointer"
          >
            Recurring Transaction
          </label>
          <p className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {isRecurring && (
        <div className='space-y-3'>
          <label className='text-sm font-medium'>Recurring Interval</label>
          <Select onValueChange = {(value) => setValue("recurringInterval",value)}
            defaultValue = {getValues("recurringInterval")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className='text-sm text-red-500'>{errors.recurringInterval.message}</p>
          )}
        </div>
      )}

      {/* BUTTONS */}
      <div className='flex gap-4 pt-6'>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  )
}

export default AddTransactionForm