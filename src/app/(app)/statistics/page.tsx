"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Percent, CheckCircle, XCircle, ListChecks } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer } from "recharts"

// Placeholder data
const generalStats = {
  averageScore: 82,
  bestScore: 95,
  worstScore: 60,
  totalSessions: 25,
  totalQuestionsAnswered: 500,
  correctAnswers: 410,
  incorrectAnswers: 90,
};

const scoreProgressionData = [
  { date: 'Jan', score: 65 },
  { date: 'Feb', score: 70 },
  { date: 'Mar', score: 72 },
  { date: 'Apr', score: 78 },
  { date: 'May', score: 80 },
  { date: 'Jun', score: 82 },
  { date: 'Jul', score: 85 },
];

const chartConfig = {
  score: {
    label: "Score (%)",
    color: "hsl(var(--accent))",
  },
};

const performanceByTopicData = [
  { topic: "Anatomy", correct: 75, total: 100 },
  { topic: "Physiology", correct: 80, total: 100 },
  { topic: "Pharmacology", correct: 60, total: 100 },
  { topic: "Pathology", correct: 90, total: 100 },
  { topic: "Biochemistry", correct: 70, total: 100 },
];

const topicChartConfig = {
  percentage: {
    label: "Correct (%)",
    color: "hsl(var(--primary))",
  },
};

export default function StatisticsPage() {
  const topicPerformance = performanceByTopicData.map(item => ({
    topic: item.topic,
    percentage: (item.correct / item.total) * 100,
  }));

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-accent" /> Your Statistics
        </h1>
        <p className="text-muted-foreground">Detailed insights into your learning journey and performance.</p>
      </div>

      {/* General Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Average Score" value={`${generalStats.averageScore}%`} icon={<Percent className="h-6 w-6 text-primary" />} />
        <StatCard title="Best Score" value={`${generalStats.bestScore}%`} icon={<TrendingUp className="h-6 w-6 text-green-500" />} />
        <StatCard title="Total Sessions" value={generalStats.totalSessions.toString()} icon={<ListChecks className="h-6 w-6 text-primary" />} />
        <StatCard title="Questions Answered" value={generalStats.totalQuestionsAnswered.toString()} icon={<ListChecks className="h-6 w-6 text-primary" />} />
        <StatCard title="Correct Answers" value={generalStats.correctAnswers.toString()} icon={<CheckCircle className="h-6 w-6 text-green-500" />} />
        <StatCard title="Incorrect Answers" value={generalStats.incorrectAnswers.toString()} icon={<XCircle className="h-6 w-6 text-red-500" />} />
      </div>

      {/* Score Progression Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Score Progression Over Time</CardTitle>
          <CardDescription>Track how your average score has improved with each session or month.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreProgressionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-score)" }} activeDot={{r:6}}/>
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance by Topic Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Performance by Topic</CardTitle>
          <CardDescription>Identify your strengths and weaknesses across different subjects.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={topicChartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="percentage" fill="var(--color-percentage)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
