"use client"; // Enables client-side rendering in Next.js App Router (for interactivity with state/hooks)

import React, { useEffect, useState } from "react";
import "@/styles/activities.css"; // Imports custom styles for this component

// Main Notification component
export default function Notification() {
    // State to track which notification IDs have been "seen" (hovered)
    const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

    // On initial load, read the seen notification IDs from localStorage (persistent state)
    useEffect(() => {
        const stored = localStorage.getItem("seenNotificationIds");
        if (stored) {
            setSeenIds(new Set(JSON.parse(stored))); // Restore IDs as a Set
        }
    }, []);

    // Whenever seenIds changes, update localStorage to persist the seen state
    useEffect(() => {
        localStorage.setItem("seenNotificationIds", JSON.stringify(Array.from(seenIds)));
    }, [seenIds]);

    // Marks a notification as "seen" when user hovers over it
    const handleSeen = (id: string) => {
        if (!seenIds.has(id)) {
            const updated = new Set(seenIds); // Create a new Set to avoid mutating state directly
            updated.add(id);
            setSeenIds(updated); // Update state with the new Set
        }
    };

    return (
        <div className="card">
            <h1 className="title">Notifications</h1>
            <div className="elements">
                <div className="activity-list">
                    {/* Notification Entry 1 */}
                    <div
                        className={`activity-entry ${!seenIds.has("notif1") ? "highlight" : ""}`} // Highlight if not yet seen
                        onMouseEnter={() => handleSeen("notif1")} // Mark as seen on hover
                    >
                        <span className="activity-action">Item A is low in stocks.</span>
                        <span className="activity-date">May 20, 2025 06:52pm</span>
                    </div>

                    {/* Notification Entry 2 */}
                    <div
                        className={`activity-entry ${!seenIds.has("notif2") ? "highlight" : ""}`}
                        onMouseEnter={() => handleSeen("notif2")}
                    >
                        <span className="activity-action">Item D is out of stocks.</span>
                        <span className="activity-date">May 18, 2025 09:21am</span>
                    </div>

                    {/* Notification Entry 3 */}
                    <div
                        className={`activity-entry ${!seenIds.has("notif3") ? "highlight" : ""}`}
                        onMouseEnter={() => handleSeen("notif3")}
                    >
                        <span className="activity-action">Item F is low in stocks.</span>
                        <span className="activity-date">May 15, 2025 12:32pm</span>
                    </div>

                    {/* Notification Entry 4 */}
                    <div
                        className={`activity-entry ${!seenIds.has("notif4") ? "highlight" : ""}`}
                        onMouseEnter={() => handleSeen("notif4")}
                    >
                        <span className="activity-action">Item C is low in stocks.</span>
                        <span className="activity-date">April 28, 2025 04:45pm</span>
                    </div>

                    {/* Notification Entry 5 */}
                    <div
                        className={`activity-entry ${!seenIds.has("notif5") ? "highlight" : ""}`}
                        onMouseEnter={() => handleSeen("notif5")}
                    >
                        <span className="activity-action">Item B is low in stocks.</span>
                        <span className="activity-date">May 20, 2025 01:39pm</span>
                    </div>
                </div>
            </div>
        </div >
    );
}
