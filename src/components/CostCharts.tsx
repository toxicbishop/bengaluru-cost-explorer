import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface CostData {
  id: string;
  category: string;
  item: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
  area: string;
}

interface CostChartsProps {
  data: CostData[];
}

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export const CostCharts = ({ data }: CostChartsProps) => {
  // Aggregate data by category for various charts
  const categoryData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        category: item.category,
        totalAvg: 0,
        count: 0,
        minPrice: Infinity,
        maxPrice: 0,
      };
    }
    acc[item.category].totalAvg += item.avgPrice;
    acc[item.category].count += 1;
    acc[item.category].minPrice = Math.min(
      acc[item.category].minPrice,
      item.minPrice
    );
    acc[item.category].maxPrice = Math.max(
      acc[item.category].maxPrice,
      item.maxPrice
    );
    return acc;
  }, {} as Record<string, any>);

  const barChartData = Object.values(categoryData).map((cat: any) => ({
    name: cat.category,
    avgCost: Math.round(cat.totalAvg / cat.count),
  }));

  const pieChartData = Object.values(categoryData).map((cat: any) => ({
    name: cat.category,
    value: cat.count,
  }));

  const radarChartData = Object.values(categoryData).map((cat: any) => ({
    category: cat.category,
    cost: Math.round(cat.totalAvg / cat.count),
    items: cat.count,
  }));

  // Get top 10 most expensive items for line chart
  const topItems = [...data]
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .slice(0, 10)
    .map((item, index) => ({
      name: item.item.substring(0, 20),
      price: item.avgPrice,
      index: index + 1,
    }));

  // Area chart for price ranges by category
  const areaChartData = Object.values(categoryData).map((cat: any) => ({
    name: cat.category,
    min: cat.minPrice,
    max: cat.maxPrice,
    avg: Math.round(cat.totalAvg / cat.count),
  }));

  return (
    <div className="space-y-8">
      {/* Bar Chart - Average Cost by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Average Cost by Category</CardTitle>
          <CardDescription>
            Compare average costs across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="avgCost"
                fill="#8b5cf6"
                name="Average Cost (₹)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pie Chart - Item Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Number of items per category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart - Multi-dimensional Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Category Radar</CardTitle>
            <CardDescription>Multi-dimensional category view</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarChartData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="category" className="text-xs" />
                <PolarRadiusAxis className="text-xs" />
                <Radar
                  name="Average Cost"
                  dataKey="cost"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart - Top Expensive Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Most Expensive Items</CardTitle>
          <CardDescription>Ranked by average price</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={topItems}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="index"
                label={{ value: "Rank", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{
                  value: "Price (₹)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-primary">₹{payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ec4899"
                strokeWidth={3}
                name="Price (₹)"
                dot={{ fill: "#ec4899", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Chart - Price Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range by Category</CardTitle>
          <CardDescription>
            Min, max, and average prices across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="max"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Max Price"
              />
              <Area
                type="monotone"
                dataKey="avg"
                stackId="2"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.6}
                name="Avg Price"
              />
              <Area
                type="monotone"
                dataKey="min"
                stackId="3"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Min Price"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
