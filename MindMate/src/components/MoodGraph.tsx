import { useMoodHistory } from '@/hooks/useMoodHistory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export function MoodGraph() {
  const { moodHistory } = useMoodHistory();
  const [timeframe, setTimeframe] = useState('weekly');

  const data = useMemo(() => {
    if (!moodHistory) return [];

    const now = new Date();
    let filteredHistory = [];

    if (timeframe === 'daily') {
      const today = now.setHours(0, 0, 0, 0);
      filteredHistory = moodHistory.filter(entry => new Date(entry.timestamp).getTime() >= today);
    } else if (timeframe === 'weekly') {
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      filteredHistory = moodHistory.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredHistory = moodHistory.filter(entry => new Date(entry.timestamp) >= oneMonthAgo);
    }

    return filteredHistory.map(entry => ({
      name: new Date(entry.timestamp).toLocaleDateString(),
      mood: entry.value,
    }));
  }, [moodHistory, timeframe]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Analytics</CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription>Visualize your mood entries over time.</CardDescription>
          <Select onValueChange={setTimeframe} defaultValue={timeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Mood Level', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}