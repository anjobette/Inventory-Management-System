import React, { useState, useRef, useEffect } from "react";

import "@/styles/moreMenu.css";

interface MoreMenuProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
}

const MoreMenu = ({ onView, onEdit, onDelete, onDownload }: MoreMenuProps) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="more-menu" ref={menuRef}>
            <button onClick={toggleMenu} className="more-btn">
                <i className="ri-more-2-line"></i>
            </button>
            {open && (
                <div className="menu-dropdown">
                    {onDownload && (
                        <button className="menu-item" onClick={onDownload}>
                            <i className="ri-file-download-line"></i> Download
                        </button>
                    )}
                    {onView && (
                        <button className="menu-item" onClick={onView}>
                            <i className="ri-eye-line"></i> View
                        </button>
                    )}
                    {onEdit && (
                        <button className="menu-item" onClick={onEdit}>
                            <i className="ri-edit-2-line"></i> Edit
                        </button>
                    )}
                    {onDelete && (
                        <button className="menu-item delete" onClick={onDelete}>
                            <i className="ri-delete-bin-line"></i> Delete
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MoreMenu;