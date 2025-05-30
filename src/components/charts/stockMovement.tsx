'use client';
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { month: 'Jan', stockIn: 120, stockOut: 80, returns: 15 },
    { month: 'Feb', stockIn: 150, stockOut: 110, returns: 0 },
    { month: 'Mar', stockIn: 180, stockOut: 140, returns: 0 },
    { month: 'Apr', stockIn: 200, stockOut: 160, returns: 18 },
    { month: 'May', stockIn: 170, stockOut: 130, returns: 25 },
    { month: 'Jun', stockIn: 220, stockOut: 180, returns: 0 },
    { month: 'Jul', stockIn: 190, stockOut: 150, returns: 16 },
    { month: 'Aug', stockIn: 210, stockOut: 170, returns: 19 },
    { month: 'Sep', stockIn: 240, stockOut: 200, returns: 28 },
    { month: 'Oct', stockIn: 0, stockOut: 0, returns: 0 },
    { month: 'Nov', stockIn: 0, stockOut: 0, returns: 0 },
    { month: 'Dec', stockIn: 0, stockOut: 0, returns: 0 },
];

export default function StockMovementChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="stockIn"
                    stroke="#2D8EFF"
                    strokeWidth={2}
                    name="Stock In"
                    dot={{ fill: '#2D8EFF', strokeWidth: 2, r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="stockOut"
                    stroke="#FF4949"
                    strokeWidth={2}
                    name="Stock Out"
                    dot={{ fill: '#FF4949', strokeWidth: 2, r: 4 }}
                />
                <Line
                    type="monotone"
                    dataKey="returns"
                    stroke="#FFCC3D"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Returns"
                    dot={{ fill: '#FFCC3D', strokeWidth: 2, r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
