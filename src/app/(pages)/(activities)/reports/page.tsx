"use client";

import { useState } from "react";
import FilterDropdown, { FilterSection } from "@/components/filterDropdown";
import MoreMenu from "@/components/moreMenu";

import "@/styles/filters.css";
import "@/styles/activities.css";

const sampleReports = [
    {
        id: 1,
        title: "Stocks Report",
        timestamp: "March 15, 2025 6:00 pm"
    },
    {
        id: 2,
        title: "Request Report",
        timestamp: "February 15, 2025 6:00 pm"
    },
    {
        id: 3,
        title: "Order Report",
        timestamp: "January 15, 2025 6:00 pm"
    },
    {
        id: 4,
        title: "Bus Report",
        timestamp: "December 15, 2024 6:00 pm"
    },
];

export default function Reports() {
    const [filters, setFilters] = useState({});

    const filterSections: FilterSection[] = [
        {
            id: "dateRange",
            title: "Date Range",
            type: "dateRange",
            defaultValue: { from: "", to: "" }
        },
        {
            id: "order",
            title: "Order",
            type: "radio",
            options: [
                { id: "asc", label: "Ascending" },
                { id: "desc", label: "Descending" }
            ],
            defaultValue: "asc"
        }
    ];

    const handleApplyFilters = (values: Record<string, any>) => {
        setFilters(values);
        // In a real app you'd fetch filtered data here
        console.log("Applied Filters:", values);
    };

    const handleMoreAction = (action: string, id: number) => {
        console.log(`Action: ${action} on report ID: ${id}`);
    };

    return (
        <div className="card">
            <h1 className="title">Report Archive</h1>

            <div className="elements">
                <div className="entries">
                    <div className="search">
                        <i className="ri-search-line" />
                        <input type="text" placeholder="Search here..." />
                    </div>

                    <FilterDropdown
                        sections={filterSections}
                        onApply={handleApplyFilters}
                    />
                </div>

                <div className="report-list">
                    {sampleReports.map((report, idx) => (
                        <div className="report-item" key={report.id}>
                            <div>
                                <div className="report-title">{report.title}</div>
                                <div className="report-time">{report.timestamp}</div>
                            </div>
                            <MoreMenu
                                onDownload={() => handleMoreAction("download", report.id)}
                                onView={() => handleMoreAction("view", report.id)}
                                onDelete={() => handleMoreAction("delete", report.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
