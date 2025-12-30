import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, PiggyBank, AlertCircle } from "lucide-react";

interface CostData {
  category: string;
  avgPrice: number;
}

interface BudgetCalculatorProps {
  data: CostData[];
}

export const BudgetCalculator = ({ data }: BudgetCalculatorProps) => {
  const [income, setIncome] = useState<string>("30000");
  const [savingsTarget, setSavingsTarget] = useState<string>("5000");
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Calculate estimated monthly expenses based on the data
  useEffect(() => {
    if (data.length === 0) return;

    // We define a "Standard Basket" of goods for one person per month
    const housing = data.find(d => d.category === "Housing")?.avgPrice || 15000;
    const utilities = data.find(d => d.category === "Utilities")?.avgPrice || 2500;
    const transport = data.find(d => d.category === "Transportation" && d.avgPrice > 500)?.avgPrice || 1500; // Monthly pass
    const food = (data.find(d => d.category === "Food")?.avgPrice || 200) * 30 * 2; // Lunch + Dinner for 30 days
    const entertainment = (data.find(d => d.category === "Entertainment")?.avgPrice || 350) * 2; // 2 movies a month

    setTotalExpenses(housing + utilities + transport + food + entertainment);
  }, [data]);

  const numericIncome = Number(income) || 0;
  const numericSavings = Number(savingsTarget) || 0;
  const balance = numericIncome - totalExpenses - numericSavings;
  const isDeficit = balance < 0;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Your Budget
          </CardTitle>
          <CardDescription>Enter your monthly details to see affordability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income (₹)</Label>
            <Input 
              id="income" 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="savings">Target Savings (₹)</Label>
            <Input 
              id="savings" 
              type="number" 
              value={savingsTarget} 
              onChange={(e) => setSavingsTarget(e.target.value)} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Result Section */}
      <Card className={isDeficit ? "border-destructive/50 bg-destructive/5" : "border-green-500/50 bg-green-500/5"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5" />
            Summary
          </CardTitle>
          <CardDescription>Estimated breakdown based on Bengaluru averages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Est. Monthly Costs:</span>
            <span className="font-semibold">₹{totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Target Savings:</span>
            <span className="font-semibold">₹{numericSavings.toLocaleString()}</span>
          </div>
          
          <div className="h-px bg-border my-2" />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Remaining Balance:</span>
            <span className={`text-2xl font-bold ${isDeficit ? "text-destructive" : "text-green-600"}`}>
              {isDeficit ? "-" : "+"}₹{Math.abs(balance).toLocaleString()}
            </span>
          </div>

          {isDeficit && (
            <div className="flex items-start gap-2 text-destructive text-sm mt-2 bg-destructive/10 p-2 rounded">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <p>Your income may not cover the average cost of living plus your savings goal.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};