"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import "@/styles/sidebar.css";

// interface SidebarProps {
//     isCollapsed: boolean;
//     setIsCollapsed: (val: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const routeToItem: { [key: string]: string } = {
        '/': 'dashboard',
        '/stock-management': 'stock-management',
        '/request-management': 'request-management',
        '/order-management': 'order-management',
        '/bus-management': 'bus-management',
        '/notification': 'notification',
        '/history': 'history',
        '/reports': 'reports'
    };

    const activitySubItems = ['/notification', '/history', '/reports'];

    // Set activeItem only on route change
    useEffect(() => {
        const current = routeToItem[pathname] ||
            (activitySubItems.includes(pathname) ? pathname.slice(1) : null);
        setActiveItem(current);
    }, [pathname]);


    const toggleSubMenu = (id: string) => {
        setOpenSubMenu(prev => (prev === id ? null : id));
    };

    // const toggleSidebar = () => {
    //     setIsCollapsed(!isCollapsed);
    // };

    // Determine if an activity subitem is active
    const isActivityItemActive = activitySubItems.includes(pathname);

    return (
        // <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} shadow-lg`} id="sidebar">
        <div className="sidebar shadow-lg" id="sidebar">
            <div className="sidebar-content">
                <div className="logo-img">
                    <img src="/logo.png" alt="logo" />
                </div>

                <div className="nav-links">
                    <Link
                        href="/"
                        className={`nav-item ${activeItem === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveItem('dashboard')}
                    >
                        <i className="ri-dashboard-line" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/stock-management"
                        className={`nav-item ${activeItem === 'stock-management' ? 'active' : ''}`}
                        onClick={() => setActiveItem('stock-management')}
                    >
                        <i className="ri-box-3-line" />
                        <span>Stock Management</span>
                    </Link>

                    <Link
                        href="/request-management"
                        className={`nav-item ${activeItem === 'request-management' ? 'active' : ''}`}
                        onClick={() => setActiveItem('request-management')}
                    >
                        <i className="ri-tools-line" />
                        <span>Request Management</span>
                    </Link>

                    <Link
                        href="/order-management"
                        className={`nav-item ${activeItem === 'order-management' ? 'active' : ''}`}
                        onClick={() => setActiveItem('order-management')}
                    >
                        <i className="ri-shopping-cart-2-line" />
                        <span>Order Management</span>
                    </Link>

                    <Link
                        href="/bus-management"
                        className={`nav-item ${activeItem === 'bus-management' ? 'active' : ''}`}
                        onClick={() => setActiveItem('bus-management')}
                    >
                        <i className="ri-bus-line" />
                        <span>Bus Management</span>
                    </Link>

                    {/* Sidebar Sub-item */}
                    <div
                        className={`nav-item module ${isActivityItemActive ? 'active' : ''}`}
                        onClick={() => toggleSubMenu('activity-submenu')}
                    >
                        <i className="ri-booklet-line" />
                        <span>Activities</span>
                        <i className={`dropdown-arrow ri-arrow-down-s-line ${openSubMenu === 'activity-submenu' ? 'rotate' : ''}`} />
                    </div>

                    {openSubMenu === 'activity-submenu' && (
                        <div className="sub-menu active">
                            <Link
                                href="/notification"
                                className={`sub-item ${activeItem === 'notification' ? 'active' : ''}`}
                                onClick={() => setActiveItem('notification')}
                            >
                                Notifications
                            </Link>

                            <Link
                                href="/history"
                                className={`sub-item ${activeItem === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveItem('history')}
                            >
                                History
                            </Link>
                            <Link
                                href="/reports"
                                className={`sub-item ${activeItem === 'reports' ? 'active' : ''}`}
                                onClick={() => setActiveItem('reports')}
                            >
                                Reports
                            </Link>
                        </div>
                    )}

                </div>

                <div className="logout">
                    <a href="#">
                        <i className="ri-logout-box-r-line" />
                        <span>Logout</span>
                    </a>
                </div>
            </div>

            {/* <div className="toggle-btn" onClick={toggleSidebar}>
                <i className="ri-arrow-left-s-line" />
            </div> */}
        </div>
    );
};

export default Sidebar;
