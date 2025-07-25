"use client";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// const COLORS = [
//   "#FF6B6B",
//   "#4ECDC9",
//   "#45B7D1",
//   "#96CEB4",
//   "#FFEEAD",
//   "#D4A5A5",
//   "#9FA8DA",
// ];
const COLORS = [
  "#D32F2F", // Dark Red
  "#1976D2", // Dark Blue
  "#388E3C", // Dark Green
  "#FBC02D", // Dark Amber/Yellow
  "#7B1FA2", // Dark Purple
  "#F57C00", // Dark Orange
  "#455A64", // Dark Gray-Blue
  "#C2185B", // Dark Pink
  "#00796B", // Dark Teal
  "#512DA8", // Deep Indigo
  "#303F9F", // Deep Blue
  "#0097A7", // Cyan-ish Blue
  "#5D4037", // Dark Brown
  "#0288D1", // Strong Sky Blue
  "#AFB42B", // Olive Green
  "#8E24AA", // Violet
  "#E64A19", // Burnt Orange
  "#616161", // Charcoal Gray
];


const DashboardOverview = ({ accounts, transactions }) => {
    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
    );
    const [chartType, setChartType] = useState("donut");
    const [isAnimating, setIsAnimating] = useState(false);
    const [chartKey, setChartKey] = useState(0); // Add this for forcing re-render

  // Filter transactions for selected account
  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5)
  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

    // Calculate expense breakdown for current month
   const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  useEffect(() => {
    setIsAnimating(true);
    setChartKey(prev => prev + 1); // Force chart to re-render with animation
    const timer = setTimeout(() => setIsAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [chartType]);

  return (
    <div className='grid gap-4 md:grid-cols-2'>
        <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <CardTitle className="text-base font-normal">Recent Transaction</CardTitle> 
    <Select 
    value = {selectedAccountId}
    onValueChange = {setSelectedAccountId}>
  <SelectTrigger className="w-[160px]">
    <SelectValue placeholder="Select account" />
  </SelectTrigger>
  <SelectContent>
    {accounts.map((account) =>(
        <SelectItem key = {account.id}value={account.id}>{account.name}</SelectItem>
    ))}
    
  </SelectContent>
</Select>
  </CardHeader>
  <CardContent>
    <div>
        <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
    <Select 
        value={chartType}
        onValueChange={setChartType}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Chart type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pie">Pie Chart</SelectItem>
          <SelectItem value="donut">Donut Chart</SelectItem>
        </SelectContent>
      </Select>
  </CardHeader>
  <CardContent className="p-0 pb-5">
    {pieChartData.length === 0 ? (
      <p className="text-center text-muted-foreground py-4">
        No expenses this month
      </p>
    ) : (
      <div className={`h-[300px] transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={chartKey}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={chartType === "donut" ? 40 : 0}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {pieChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              animationDuration={300}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
  </CardContent>
</Card>
    </div>
  )
}

export default DashboardOverview