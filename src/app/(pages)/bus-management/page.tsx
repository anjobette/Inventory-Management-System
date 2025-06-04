"use client";

import React, { useState, useMemo } from "react";
import ActionButtons from "@/components/actionButtons";
import ModalManager from "@/components/modalManager";
import FilterDropdown, { FilterSection } from "@/components/filterDropdown";
import PaginationComponent from "@/components/pagination";

import AddBusModal from "./addBusModal";
import ViewBusModal from "./viewBusModal";
import EditBusModal from "./editBusModal";
import { BusForm } from "./addBusModal";

import "@/styles/filters.css"
import "@/styles/tables.css"
import "@/styles/chips.css"

const hardcodedData = [
    {
        id: 1,
        bodyNumber: "1001A",
        bodyBuilder: "Agila",
        route: "Sapang Palay - PITX",
        busType: "Airconditioned",
        busStatus: "active",
    },
    {
        id: 2,
        bodyNumber: "1002B",
        bodyBuilder: "DARJ",
        route: "Sapang Palay - PITX",
        busType: "Ordinary",
        busStatus: "decommissioned",
    },
    {
        id: 3,
        bodyNumber: "1003C",
        bodyBuilder: "Hilltop",
        route: "Sapang Palay - Santa Cruz",
        busType: "Airconditioned",
        busStatus: "under-maintenance",
    },
    {
        id: 4,
        bodyNumber: "1004A",
        bodyBuilder: "Agila",
        route: "Sapang Palay - Santa Cruz",
        busType: "Airconditioned",
        busStatus: "active",

    },
    {
        id: 5,
        bodyNumber: "1005",
        bodyBuilder: "RBM",
        route: "Sapang Palay - PITX",
        busType: "Ordinary",
        busStatus: "active",
    },
];

export default function BusManagement() {
    // for modal
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<any>(null);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    // For filtering
    const [filteredData, setFilteredData] = useState(hardcodedData);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // default number of rows per page

    // Calculate paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, pageSize]);

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle page size change
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    // Filter sections
    const filterSections: FilterSection[] = [
        {
            id: "dateRange",
            title: "Date Range",
            type: "dateRange",
            defaultValue: { from: "", to: "" }
        },
        {
            id: "bodyBuilder",
            title: "Body Builder",
            type: "checkbox",
            options: [
                { id: "agila", label: "Agila" },
                { id: "hilltop", label: "Hilltop" },
                { id: "rbm", label: "RBM" },
                { id: "darj", label: "DARJ" }
            ]
        },
        {
            id: "route",
            title: "Route",
            type: "checkbox",
            options: [
                { id: "sapang palay - pitx", label: "Sapang Palay - PITX" },
                { id: "sapang palay - santa cruz", label: "Sapang Palay - Santa Cruz" }
            ]
        },
        {
            id: "busStatus",
            title: "Status",
            type: "checkbox",
            options: [
                { id: "active", label: "Active" },
                { id: "decommissioned", label: "Decommissioned" },
                { id: "under-maintenance", label: "Under Maintenance" }
            ]
        },
        {
            id: "busType",
            title: "Bus Type",
            type: "checkbox",
            options: [
                { id: "airconditioned", label: "Airconditioned" },
                { id: "ordinary", label: "Ordinary" }
            ]
        },
        {
            id: "sortBy",
            title: "Sort By",
            type: "radio",
            options: [
                { id: "bodyNumber", label: "Body Number" },
                { id: "bodyBuilder", label: "Body Builder" }
            ],
            defaultValue: "bodyNumber"
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

    // Handle filter application
    const handleApplyFilters = (filterValues: Record<string, any>) => {
        console.log("Applied filters:", filterValues);

        // In a real application, you would filter your data based on these values
        // For now, we'll just log them and keep the original data

        // Example implementation for filtering and sorting:
        let newData = [...hardcodedData];

        // Filter by bodyBuilder if selected
        if (filterValues.bodyBuilder && filterValues.bodyBuilder.length > 0) {
            newData = newData.filter(item => filterValues.bodyBuilder.includes(item.bodyBuilder.toLowerCase())
            );
        }

        // Filter by route if selected
        if (filterValues.route && filterValues.route.length > 0) {
            newData = newData.filter(item => filterValues.route.includes(item.route.toLowerCase())
            );
        }

        // Filter by busStatus if selected
        if (filterValues.busStatus && filterValues.busStatus.length > 0) {
            newData = newData.filter(item => filterValues.busStatus.includes(item.busStatus));
        }

        // Filter by busType if selected
        if (filterValues.busType && filterValues.busType.length > 0) {
            newData = newData.filter(item => filterValues.busType.includes(item.busType.toLowerCase())
            );
        }

        // Sort by bodyNumber or bodyBuilder
        if (filterValues.sortBy === "bodyNumber") {
            newData.sort((a, b) => {
                const sortOrder = filterValues.order === "asc" ? 1 : -1;
                return a.bodyNumber.localeCompare(b.bodyNumber) * sortOrder;
            });
        } else if (filterValues.sortBy === "bodyBuilder") {
            newData.sort((a, b) => {
                const sortOrder = filterValues.order === "asc" ? 1 : -1;
                return a.bodyBuilder.localeCompare(b.bodyBuilder) * sortOrder;
            });
        }

        setFilteredData(newData);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // for items busStatus formatting
    const formatStatus = (busStatus: string) => {
        switch (busStatus) {
            case "active":
                return "Active";
            case "decommissioned":
                return "Decommissioned";
            case "under-maintenance":
                return "Under Maintenance";
            default:
                return busStatus;
        }
    };

    // for the modals of add, view, and edit
    const openModal = (mode: "add-bus" | "view-bus" | "edit-bus", rowData?: any) => {
        let content;

        switch (mode) {
            case "add-bus":
                content = <AddBusModal
                    onSave={handleAddBus}
                    onClose={closeModal}
                />;
                break;
            case "view-bus":
                content = <ViewBusModal
                    item={rowData}
                    formatStatus={formatStatus}
                    onClose={closeModal}
                />;
                break;
            case "edit-bus":
                content = <EditBusModal
                    item={rowData}
                    onSave={handleEditBus}
                    onClose={closeModal}
                />;
                break;
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

    // Handle add bus
    const handleAddBus = (busForm: BusForm) => {
        console.log("Saving forms:", busForm);
        // Logic to add bus to the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    // Handle edit bus
    const handleEditBus = (updatedItem: any) => {
        console.log("Updating item:", updatedItem);
        // Logic to update the item in the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    return (
        <div className="card">
            <h1 className="title">Bus Management</h1>

            {/* Search Engine and Filters */}
            <div className="elements">
                <div className="entries">
                    <div className="search">
                        <i className="ri-search-line" />
                        <input type="text" placeholder="Search here..." />
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
                    <button className="main-btn" onClick={() => openModal("add-bus")}>
                        <i className="ri-add-line" /> Add Bus
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="data-table">
                            <thead className="table-heading">
                                <tr>
                                    <th>Body Number</th>
                                    <th>Body Builder</th>
                                    <th>Route</th>
                                    <th>Status</th>
                                    <th>Bus Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {paginatedData.map(item => (
                                    <tr
                                        key={item.id}
                                        className={selectedIds.includes(item.id) ? "selected" : ""}
                                    >
                                        <td>{item.bodyNumber}</td>
                                        <td>{item.bodyBuilder}</td>
                                        <td>{item.route}</td>
                                        <td className="table-status">
                                            <span className={`chip ${item.busStatus}`}>
                                                {formatStatus(item.busStatus)}
                                            </span>
                                        </td>
                                        <td>{item.busType}</td>
                                        <td>
                                            <ActionButtons
                                                onView={() => openModal("view-bus", item)}
                                                onEdit={() => openModal("edit-bus", item)}
                                            />
                                        </td>
                                    </tr>
                                ))}
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