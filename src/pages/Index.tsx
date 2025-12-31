import { useState, useEffect, useMemo } from "react";
import { ContributeForm } from "@/components/ContributeForm";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Added 'Mail' icon to imports
import { Search, Filter, Calculator, PieChart as PieChartIcon, Check, Sun, Moon, Home, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 

const Index = () => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Calculator State
  const [selectedCalculations, setSelectedCalculations] = useState<string[]>(["Housing", "Food"]);

  // Fetch data
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('cost_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching data:', error);
    else setItems(data || []);
  };

  useEffect(() => {
    fetchData();
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- Derived Data Logic ---
  const filteredItems = items.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    items.forEach(item => {
      const cat = item.category; 
      if (!stats[cat]) stats[cat] = { total: 0, count: 0 };
      stats[cat].total += Number(item.avg_price);
      stats[cat].count += 1;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count)
    }));
  }, [items]);

  const estimatedTotal = categoryStats
    .filter(stat => selectedCalculations.includes(stat.name))
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalValue = categoryStats.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;
  
  const pieGradient = categoryStats.length > 0 
    ? categoryStats.map((stat, index) => {
        const percentage = (stat.value / totalValue) * 100;
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        const color = colors[index % colors.length];
        const start = currentAngle;
        currentAngle += percentage;
        return `${color} ${start}% ${currentAngle}%`;
      }).join(', ')
    : '#334155 0% 100%';

  const toggleCalculation = (catName: string) => {
    if (selectedCalculations.includes(catName)) {
      setSelectedCalculations(selectedCalculations.filter(c => c !== catName));
    } else {
      setSelectedCalculations([...selectedCalculations, catName]);
    }
  };

  const theme = {
    bg: isDarkMode ? "bg-slate-950" : "bg-slate-50",
    text: isDarkMode ? "text-white" : "text-slate-900",
    card: isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm",
    cardText: isDarkMode ? "text-slate-100" : "text-slate-900",
    subText: isDarkMode ? "text-slate-400" : "text-slate-500",
    input: isDarkMode ? "bg-slate-900/80 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900",
    stickyBar: isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200",
    footer: isDarkMode ? "bg-black border-slate-900 text-slate-400" : "bg-white border-slate-200 text-slate-600",
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${theme.bg} ${theme.text}`}>
      
      {/* --- TOP RIGHT NAVIGATION --- */}
      <nav className="absolute top-0 right-0 p-4 md:p-6 flex items-center gap-4 z-50">
        <Link to="/">
          <Button 
            variant="ghost" 
            className={`gap-2 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </Link>
        
        <Link to="/about">
          <Button 
            variant="ghost" 
            className={`gap-2 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Info className="w-4 h-4" /> About Us
          </Button>
        </Link>

        {/* LINK TO CONTACT PAGE */}
        <Link to="/contact">
          <Button 
            variant="ghost" 
            className={`gap-2 ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200 text-slate-700'}`}
          >
            <Mail className="w-4 h-4" /> Contact
          </Button>
        </Link>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className={`rounded-full ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'}`}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </Button>
      </nav>

      {/* MAIN CONTENT WRAPPER */}
      <div className="p-6 md:p-8 flex flex-col gap-12 max-w-7xl mx-auto w-full flex-grow pt-20">
        
        {/* 1. STICKY SEARCH BAR */}
        <div className={`w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-center p-4 rounded-full border backdrop-blur-sm sticky top-4 z-40 shadow-xl transition-colors ${theme.stickyBar}`}>
          <div className="relative w-full md:w-96">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.subText}`} />
            <Input 
              placeholder="Search items (e.g., 'Rent', 'Dosa')..." 
              className={`pl-10 bg-transparent border-none focus-visible:ring-0 ${theme.text} placeholder:${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={`h-6 w-px hidden md:block ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
          <div className="w-full md:w-48 flex items-center gap-2">
            <Filter className={`w-4 h-4 ml-2 ${theme.subText}`} />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={`bg-transparent border-none focus:ring-0 ${theme.text}`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Housing">Housing</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2. TITLE */}
        <div className="text-center space-y-2 mt-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight pb-6 leading-normal">
            Cost of Living Bengaluru
          </h1>
        </div>

        {/* 3. DASHBOARD */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
          <Card className={`${theme.card} transition-colors`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-500">
                <Calculator className="w-5 h-5" /> Monthly Estimator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`mb-6 text-center p-6 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-sm block mb-1 ${theme.subText}`}>Estimated Monthly Cost</span>
                <span className={`text-4xl font-bold ${theme.cardText}`}>₹{estimatedTotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryStats.map((stat) => (
                  <Button
                    key={stat.name}
                    variant={selectedCalculations.includes(stat.name) ? "default" : "outline"}
                    onClick={() => toggleCalculation(stat.name)}
                    className={`text-xs h-8 ${
                      selectedCalculations.includes(stat.name) 
                        ? 'bg-blue-600 hover:bg-blue-700 border-none text-white' 
                        : `bg-transparent ${isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-100'}`
                    }`}
                  >
                    {stat.name} (+₹{stat.value})
                    {selectedCalculations.includes(stat.name) && <Check className="w-3 h-3 ml-1" />}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`${theme.card} transition-colors`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-500">
                <PieChartIcon className="w-5 h-5" /> Cost Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center gap-8">
              <div 
                className="w-40 h-40 rounded-full shrink-0 relative shadow-xl transition-all duration-500"
                style={{ background: `conic-gradient(${pieGradient})` }}
              >
                <div className={`absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                  <span className={`text-xs ${theme.subText}`}>Avg Prices</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {categoryStats.map((stat, index) => {
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-violet-500', 'bg-pink-500'];
                  return (
                    <div key={stat.name} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                      <span className={theme.subText}>{stat.name}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. DATA GRID */}
        <div className="max-w-6xl mx-auto w-full">
          <h3 className={`text-xl font-semibold mb-6 border-l-4 border-blue-500 pl-3 ${theme.cardText}`}>Recent Contributions</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`${theme.card} transition-all group hover:border-blue-500/50`}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${isDarkMode ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {item.category}
                    </span>
                    <span className={`text-xs ${theme.subText} group-hover:text-blue-500 transition-colors`}>{item.area}</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${theme.cardText}`}>{item.item}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-500">₹{item.avg_price}</span>
                    <span className={`text-sm ${theme.subText}`}>/ {item.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredItems.length === 0 && (
              <div className={`col-span-full text-center py-20 rounded-xl border border-dashed ${isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100/50 border-slate-300'}`}>
                <p className={theme.subText}>No items found. Try a different search.</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. CONTRIBUTE FORM */}
        <div className={`mt-10 border-t pt-10 max-w-2xl mx-auto w-full ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-semibold ${theme.cardText}`}>Missing something?</h2>
            <p className={theme.subText}>Add a new item to the database below.</p>
          </div>
          <ContributeForm onDataAdded={fetchData} />
        </div>
      </div>

      {/* --- FOOTER with EXTERNAL LINKS --- */}
      <footer className={`${theme.footer} py-12 border-t transition-colors`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Left: Social Media */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className={`font-bold tracking-wider text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>SOCIAL MEDIA</h4>
            <div className="flex gap-3">
              {/* X (Twitter) */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:-translate-y-1 ${isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-800 shadow-sm'}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
              </a>
              
              {/* Instagram */}
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-600 text-white hover:opacity-90 transition-transform hover:-translate-y-1 shadow-sm">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              
              {/* YouTube */}
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white hover:opacity-90 transition-transform hover:-translate-y-1 shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Right: Links & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
            <div className="flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Terms & Conditions</a>
            </div>
            <div className="text-xs opacity-70">
              Copyright ©2025 Bengaluru Living Cost Project. All rights reserved.
            </div>
          </div>

        </div>
      </footer>
      {/* --- END FOOTER --- */}
    </div>
  );
};

export default Index;