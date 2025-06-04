"use client";

// import { useState } from 'react';
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

import "@/styles/globals.css";
import "@/styles/index.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    // const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <html lang="en">
            <head>
                <title>Inventory Management System</title>
                <link rel="icon" href="/favicon.png" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
            </head>

            <body>
                {/* <div className={`app-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
                    <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}

                <div className="app-wrapper">
                    <Sidebar />

                    <div className="layout-right">
                        <Topbar />

                        <div className="content">
                            <div className="page-content">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
