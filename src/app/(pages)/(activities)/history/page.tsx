import "@/styles/activities.css";

// Main History component rendering the formatted entries
export default function History() {
    return (
        <div className="card">
            <h1 className="title">History</h1>
            <div className="elements">
                <div className="activity-list">
                    <div className="activity-entry">
                        <span className="activity-action">2 items was added to stocks.</span>
                        <span className="activity-date">May 20, 2025 06:52pm</span>
                    </div>

                    <div className="activity-entry">
                        <span className="activity-action">1 bus was added.</span>
                        <span className="activity-date">May 18, 2025 09:21am</span>
                    </div>

                    <div className="activity-entry">
                        <span className="activity-action">1 item was updated.</span>
                        <span className="activity-date">May 15, 2025 12:32pm</span>
                    </div>

                    <div className="activity-entry">
                        <span className="activity-action">1 order was added</span>
                        <span className="activity-date">April 28, 2025 04:45pm</span>
                    </div>

                    <div className="activity-entry">
                        <span className="activity-action">1 request was added</span>
                        <span className="activity-date">May 20, 2025 01:39pm</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
