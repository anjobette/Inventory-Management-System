"use client";

import React, { useState, useEffect, useMemo } from "react";
import ActionButtons from "@/components/actionButtons";
import ModalManager from "@/components/modalManager";
import FilterDropdown, { FilterSection } from "@/components/filterDropdown";
import PaginationComponent from "@/components/pagination";
import Loading from "@/components/loading";
import { showStockDeleteConfirmation, showStockDeletedSuccess, showStockSaveError, showDeleteError } from "@/utils/sweetAlert";

import AddStockModal from "./addStockModal";
import ViewStockModal from "./viewStockModal";
import EditStockModal from "./editStockModal";
import { StockForm } from "./addStockModal";

import "@/styles/filters.css"
import "@/styles/tables.css"
import "@/styles/chips.css"
import "@/styles/loading.css"

// Type definitions based on your Prisma schema
interface InventoryItem {
    item_id: string;
    f_item_id: string;
    item_name: string;
    current_stock: number;
    unit_measure: string;
    status: string;
    category_id: string; // This is the foreign key
    category: {         // This is the relation object
        category_id: string;
        category_name: string;
    };
    date_updated: string;
    reorder_level: number;
    batches: {
        batch_id: string;
        usable_quantity: number;
        defective_quantity: number;
        missing_quantity: number;
        expiration_date: string | null;
    }[];
}

interface ApiResponse {
    success: boolean;
    items: InventoryItem[];
    error?: string;
}

export default function StocksManagement() {
    // Data state
    const [stockItems, setStockItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    // Pagination state - Updated to match old file's approach
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Default to 5 like the old file

    // for modal
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<any>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    // Fetch data from API
    useEffect(() => {
        fetchStockItems();
    }, []);

    const fetchStockItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/item');
            const data: ApiResponse = await response.json();

            if (data.success) {
                setStockItems(data.items);
                setError(null);
            } else {
                setError(data.error || 'Failed to fetch stock items');
            }
        } catch (err) {
            const errorMessage = 'Error fetching stock items';
            setError(errorMessage);
            console.error('Error fetching stock items:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter sections for the filter dropdown - Enhanced with proper categories
    const filterSections: FilterSection[] = [
        {
            id: "dateRange",
            title: "Date Range",
            type: "dateRange",
            defaultValue: { from: "", to: "" }
        },
        {
            id: "category",
            title: "Categories",
            type: "checkbox",
            options: [
                { id: "Consumable", label: "Consumables" },
                { id: "Tool", label: "Tools" },
                { id: "Machine", label: "Machines" },
                { id: "Equipment", label: "Equipments" }
            ]
        },
        {
            id: "status",
            title: "Status",
            type: "checkbox",
            options: [
                { id: "AVAILABLE", label: "Available" },
                { id: "OUT_OF_STOCK", label: "Out of Stock" },
                { id: "UNDER_MAINTENANCE", label: "Under Maintenance" },
                { id: "LOW_STOCK", label: "Low Stock" },
                { id: "EXPIRED", label: "Expired" }
            ]
        },
        {
            id: "sortBy",
            title: "Sort By",
            type: "radio",
            options: [
                { id: "item_name", label: "Item Name" },
                { id: "current_stock", label: "Current Stock" },
                { id: "reorder_level", label: "Reorder Level" }
            ],
            defaultValue: "item_name"
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

    // Enhanced filter and search logic
    const filteredAndSearchedItems = useMemo(() => {
        let filtered = [...stockItems];

        // Apply search filter
        if (searchTerm.trim()) {
            filtered = filtered.filter(item =>
                item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.unit_measure.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (filterValues.status && filterValues.status.length > 0) {
            filtered = filtered.filter(item => filterValues.status.includes(item.status));
        }

        if (filterValues.category && filterValues.category.length > 0) {
            filtered = filtered.filter(item => filterValues.category.includes(item.category.category_name));
        }

        if (filterValues.dateRange && (filterValues.dateRange.from || filterValues.dateRange.to)) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date_updated);
                const fromDate = filterValues.dateRange.from ? new Date(filterValues.dateRange.from) : null;
                const toDate = filterValues.dateRange.to ? new Date(filterValues.dateRange.to) : null;

                // If both dates are provided
                if (fromDate && toDate) {
                    return itemDate >= fromDate && itemDate <= toDate;
                }
                // If only from date is provided
                else if (fromDate) {
                    return itemDate >= fromDate;
                }
                // If only to date is provided
                else if (toDate) {
                    return itemDate <= toDate;
                }

                return true;
            });
        }

        // Apply sorting
        const sortBy = filterValues.sortBy || "item_name";
        const order = filterValues.order || "asc";

        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "item_name":
                    aValue = a.item_name.toLowerCase();
                    bValue = b.item_name.toLowerCase();
                    break;
                case "current_stock":
                    aValue = a.current_stock;
                    bValue = b.current_stock;
                    break;
                case "reorder_level":
                    aValue = a.reorder_level;
                    bValue = b.reorder_level;
                    break;
                default:
                    aValue = a.item_name.toLowerCase();
                    bValue = b.item_name.toLowerCase();
            }

            if (typeof aValue === "string") {
                const comparison = aValue.localeCompare(bValue);
                return order === "asc" ? comparison : -comparison;
            } else {
                const comparison = aValue - bValue;
                return order === "asc" ? comparison : -comparison;
            }
        });

        return filtered;
    }, [stockItems, searchTerm, filterValues]);

    const totalPages = Math.ceil(filteredAndSearchedItems.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = filteredAndSearchedItems.slice(startIndex, startIndex + pageSize);

    const getDateRangeDisplay = () => {
        if (!filterValues.dateRange) return null;

        const { from, to } = filterValues.dateRange;
        if (!from && !to) return null;

        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        if (from && to) {
            return `Items filtered from ${formatDate(from)} to ${formatDate(to)}`;
        } else if (from) {
            return `Items filtered from ${formatDate(from)}`;
        } else if (to) {
            return `Items filtered up to ${formatDate(to)}`;
        }

        return null;
    };

    // Generate page numbers for pagination - improved version
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Handle filter application - enhanced from old file
    const handleApplyFilters = (newFilterValues: Record<string, any>) => {
        console.log("Applied filters:", newFilterValues);
        setFilterValues(newFilterValues);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    };

    // Handle pagination - updated to support page size changes like old file
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    // Status formatting function
    const formatStatus = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "Available";
            case "OUT_OF_STOCK":
                return "Out of Stock";
            case "LOW_STOCK":
                return "Low Stock";
            case "UNDER_MAINTENANCE":
                return "Under Maintenance";
            case "EXPIRED":
                return "Expired";
            default:
                return status;
        }
    };

    // Get CSS class for status
    const getStatusClass = (status: string) => {
        switch (status) {
            case "AVAILABLE":
                return "available";
            case "OUT_OF_STOCK":
                return "out-of-stock";
            case "LOW_STOCK":
                return "low-stock";
            case "UNDER_MAINTENANCE":
                return "maintenance";
            case "EXPIRED":
                return "expired";
            default:
                return status.toLowerCase().replace(/_/g, '-');
        }
    };

    // for the modals of add, view, edit, and delete
    const openModal = (mode: "add-stock" | "view-stock" | "edit-stock" | "delete-stock", rowData?: any) => {
        let content;

        switch (mode) {
            case "add-stock":
                content = <AddStockModal
                    onSave={handleAddStock}
                    onClose={closeModal}
                />;
                break;
            case "view-stock":
                content = <ViewStockModal
                    item={rowData}
                    formatStatus={formatStatus}
                    onClose={closeModal}
                />;
                break;
            case "edit-stock":
                content = <EditStockModal
                    item={rowData}
                    onSave={handleEditStock}
                    onClose={closeModal}
                />;
                break;
            case "delete-stock":
                // Check stock before allowing deletion
                if (rowData && rowData.current_stock > 0) {
                    showDeleteError(rowData.item_name || rowData.name, rowData.current_stock);
                    return;
                }
                handleDeleteStock(rowData);
                return;
            default:
                content = null;
        }

        setModalContent(content);
        setActiveRow(rowData || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
        setActiveRow(null);
    };

    // Handle add stocks
    const handleAddStock = (stockForms: StockForm[]) => {
        console.log("Saving forms:", stockForms);
        // Logic to add multiple stock items to the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    // Handle edit stocks
    const handleEditStock = (updatedItem: any) => {
        console.log("Updating item:", updatedItem);
        // Logic to update the item in the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    // Handle delete stocks
    const handleDeleteStock = async (rowData: any) => {
        try {
            const result = await showStockDeleteConfirmation(rowData.name || rowData.item_name);

            if (result.isConfirmed) {
                // Call the soft delete API
                const response = await fetch(`/api/item`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ item_id: rowData.item_id }),
                });

                const data = await response.json();
                if (data.success) {
                    await showStockDeletedSuccess(rowData.name || rowData.item_name);
                    window.location.reload();
                    console.log("Deleted row with id:", rowData.id);
                } else {
                    await showDeleteError(rowData.item_name || rowData.name, rowData.current_stock);
                }
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
            await showStockSaveError('An unexpected error occurred');
        }
    };

    if (loading) {
        return (
            <div className="card">
                <h1 className="title">Stock Management</h1>
                <Loading />
            </div>
        );
    }

    if (error && stockItems.length === 0) {
        return (
            <div className="card">
                <h1 className="title">Stock Management</h1>
                <div className="fetch-container">
                    <div className="fetch-error">
                        <i className="ri-error-warning-line" />
                        {error}
                    </div>
                    <button className="retry-btn" onClick={fetchStockItems}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h1 className="title">Stock Management</h1>

            {/* Search Engine and Status Filters */}
            <div className="elements">
                <div className="entries">
                    <div className="search">
                        <i className="ri-search-line" />
                        <input
                            type="text"
                            placeholder="Search item name or unit measure"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Filter Button with Dropdown */}
                    <div className="filter">
                        <FilterDropdown
                            sections={filterSections}
                            onApply={handleApplyFilters}
                        />
                    </div>

                    {/* Generate Report Button */}
                    <button type="button" className="generate-btn">
                        <i className="ri-receipt-line" /> Generate Report
                    </button>

                    {/* Add Stocks Button */}
                    <button className="main-btn" onClick={() => openModal("add-stock")}>
                        <i className="ri-add-line" /> Add Stocks
                    </button>
                </div>

                {getDateRangeDisplay() && (
                    <div className="filter-results">
                        {getDateRangeDisplay()}
                    </div>
                )}

                {/* Table */}
                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="data-table">
                            <thead className="table-heading">
                                <tr>
                                    <th>Item Name</th>
                                    <th>Current Stock</th>
                                    <th>Unit Measure</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Reorder Level</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {paginatedItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="no-records">
                                            {searchTerm || Object.keys(filterValues).some(key =>
                                                filterValues[key] &&
                                                (Array.isArray(filterValues[key]) ? filterValues[key].length > 0 : true)
                                            )
                                                ? 'No items matched'
                                                : 'No stock items available'
                                            }
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map(item => (
                                        <tr
                                            key={item.item_id}
                                            className={selectedIds.includes(parseInt(item.item_id)) ? "selected" : ""}
                                        >
                                            <td>{item.item_name}</td>
                                            <td>{item.current_stock}</td>
                                            <td>{item.unit_measure}</td>
                                            <td>{item.category.category_name}</td>
                                            <td className="table-status">
                                                <span className={`chip ${getStatusClass(item.status)}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </td>
                                            <td>{item.reorder_level}</td>
                                            <td>
                                                <ActionButtons
                                                    onView={() => openModal("view-stock", item)}
                                                    onEdit={() => openModal("edit-stock", item)}
                                                    onDelete={() => openModal("delete-stock", item)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>

            {/* Dynamic Modal Manager */}
            <ModalManager
                isOpen={isModalOpen}
                onClose={closeModal}
                modalContent={modalContent}
            />

        </div>
    );
}