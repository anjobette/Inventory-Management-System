'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'In Stock', value: 400, color: '#13CE66' },
    { name: 'Low Stock', value: 300, color: '#FFCC3D' },
    { name: 'Out of Stock', value: 200, color: '#FF4949' },
    { name: 'Under Maintenance', value: 100, color: '#2D8EFF' },
    { name: 'Expired', value: 20, color: '#B3B3B3' },
];

export default function StockDistributionChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}