/**
 * Charts — simple bar and line chart wrappers using Recharts.
 */
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './Charts.module.css';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  className?: string;
}

export const LineChart: React.FC<ChartProps> = ({
  data,
  color = '#FF6B4A',
  height = 240,
  className = '',
}) => {
  return (
    <div className={[styles.chartContainer, className].filter(Boolean).join(' ')} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" vertical={false} />
          <XAxis dataKey="label" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 4 }} />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({
  data,
  color = '#14B8A6',
  height = 240,
  className = '',
}) => {
  return (
    <div className={[styles.chartContainer, className].filter(Boolean).join(' ')} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E1" vertical={false} />
          <XAxis dataKey="label" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
};

