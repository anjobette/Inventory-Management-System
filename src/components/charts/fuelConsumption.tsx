'use client';
import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { month: 'Jan', consumption: 400, predicted: 480 },
    { month: 'Feb', consumption: 300, predicted: 330 },
    { month: 'Mar', consumption: 500, predicted: 410 },
    { month: 'Apr', consumption: 450, predicted: 495 },
    { month: 'May', consumption: 380, predicted: 290 },
    { month: 'Jun', consumption: 520, predicted: 710 },
    { month: 'Jul', consumption: 600, predicted: 590 },
    { month: 'Aug', consumption: 580, predicted: 525 },
    { month: 'Sep', consumption: 420, predicted: 330 },
    { month: 'Oct', consumption: 0, predicted: 500 },
    { month: 'Nov', consumption: 0, predicted: 495 },
    { month: 'Dec', consumption: 0, predicted: 350 },
];

export default function FuelConsumptionChart() {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    formatter={(value, name) => {
                        if (name === 'consumption') return [`${value} gallons`, 'Actual Consumption'];
                        if (name === 'predicted') return [`${value} gallons`, 'Predicted Consumption'];
                        return [value, name];
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />

                {/* Bar Chart */}
                <Bar
                    dataKey="consumption"
                    fill="#2D8EFF"
                    name="Actual Consumption"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                />

                {/* Line Chart */}
                <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#13CE66"
                    strokeWidth={4}
                    strokeDasharray="8 4"
                    name="Predicted Consumption"
                    dot={{ fill: '#13CE66', strokeWidth: 3, r: 6, stroke: '#ffffff' }}
                    activeDot={{ r: 8, stroke: '#13CE66', strokeWidth: 2, fill: '#ffffff' }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
