'use client';

import React from 'react';
import '../styles/dashboard.css';
import FuelConsumptionChart from '@/components/charts/fuelConsumption';
import StockDistributionChart from '@/components/charts/stockDistribution';
import StockMovementChart from '@/components/charts/stockMovement';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h2 className="overview">Overview</h2>
                <div className="range-inputs">
                    <p className="date-label">Date Range:</p>
                    <input className="range" type="date" /> -
                    <input className="range" type="date" />
                </div>
            </div>


            {/* Summary dash-card - Grouped */}
            <div className="summary-groups">
                <div className="summary-group">
                    <div className="dash-card">Low Stocks <span>14</span></div>
                    <div className="dash-card">Out of Stock <span>6</span></div>
                </div>
                <div className="summary-group">
                    <div className="dash-card">On Order <span>10</span></div>
                    <div className="dash-card">Unreturned Items <span>3</span></div>
                </div>
            </div>


            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Fuel Consumption Analysis and Prediction</h3>
                    <div className="placeholder"><FuelConsumptionChart /></div>
                </div>

                {/* <div className="chart-box">
                    <h3>Stock Movement Analysis</h3>
                    <div className="placeholder"><StockMovementChart /></div>
                </div> */}
            </div>

            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Stock Movement Analysis</h3>
                    <div className="placeholder"><StockMovementChart /></div>
                </div>

                <div className="chart-box">
                    <h3>Stock Status Distribution</h3>
                    <div className="placeholder"><StockDistributionChart /></div>
                </div>

                {/* <div className="chart-box">
                    <h3>Top Utilized Stock Items</h3>
                    <div className="placeholder"><TopUtilizedChart /></div>
                </div> */}
            </div>
        </div>


    )
}