"use client";

import React, { useState, useMemo } from "react";
import ActionButtons from "@/components/actionButtons";
import ModalManager from "@/components/modalManager";
import FilterDropdown, { FilterSection } from "@/components/filterDropdown";
import PaginationComponent from "@/components/pagination";
import { showRequestDeleteConfirmation, showRequestDeletedSuccess } from "@/utils/sweetAlert";

import AddRequestModal from "./addRequestModal";
import ViewRequestModal from "./viewRequestModal";
import EditRequestModal from "./editRequestModal";
import { RequestForm } from "./addRequestModal";

import "@/styles/filters.css"
import "@/styles/tables.css"
import "@/styles/chips.css"

const hardcodedData = [
    {
        id: 1,
        empName: "Bette Anjanelle Cabarles",
        type: "Borrow",
        itemName: "Item Example A",
        reqDate: "3/12/2025",
        reqStatus: "returned",
    },
    {
        id: 2,
        empName: "Kristine Mae Cleofas",
        type: "Consume",
        itemName: "Item Example C",
        reqDate: "5/1/2025",
        reqStatus: "consumed",
    },
    {
        id: 3,
        empName: "Christelle Anne Dacapias",
        type: "Consume",
        itemName: "Item Example B",
        reqDate: "4/27/2025",
        reqStatus: "not-returned",
    },
    {
        id: 4,
        empName: "Sean Arjunell Cabarles",
        type: "Borrow",
        itemName: "Item Example A",
        reqDate: "3/19/2025",
        reqStatus: "not-returned",
    },
    {
        id: 5,
        empName: "Kathleen Cleofas",
        type: "Consume",
        itemName: "Item Example E",
        reqDate: "5/6/2025",
        reqStatus: "consumed",
    },
    // Add more dummy data to test pagination
    {
        id: 6,
        empName: "John Doe Smith",
        type: "Borrow",
        itemName: "Item Example F",
        reqDate: "4/15/2025",
        reqStatus: "returned",
    },
    {
        id: 7,
        empName: "Jane Marie Santos",
        type: "Consume",
        itemName: "Item Example G",
        reqDate: "5/8/2025",
        reqStatus: "consumed",
    },
    {
        id: 8,
        empName: "Mark Anthony Cruz",
        type: "Borrow",
        itemName: "Item Example H",
        reqDate: "4/20/2025",
        reqStatus: "not-returned",
    },
    {
        id: 9,
        empName: "Maria Clara Reyes",
        type: "Consume",
        itemName: "Item Example I",
        reqDate: "5/12/2025",
        reqStatus: "consumed",
    },
    {
        id: 10,
        empName: "Jose Rizal Garcia",
        type: "Borrow",
        itemName: "Item Example J",
        reqDate: "3/25/2025",
        reqStatus: "returned",
    },
];

export default function RequestManagement() {
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
            id: "type",
            title: "Request Type",
            type: "checkbox",
            options: [
                { id: "borrow", label: "Borrow" },
                { id: "consume", label: "Consume" }
            ]
        },
        {
            id: "reqStatus",
            title: "Status",
            type: "checkbox",
            options: [
                { id: "returned", label: "Returned" },
                { id: "not-returned", label: "Not Retuned" },
                { id: "consumed", label: "Consumed" }
            ]
        },
        {
            id: "sortBy",
            title: "Sort By",
            type: "radio",
            options: [
                { id: "empName", label: "Employee Name" },
                { id: "itemName", label: "Item Name" },
                { id: "reqDate", label: "Request Date" }
            ],
            defaultValue: "empName"
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

        // Filter by request type if selected
        if (filterValues.type && filterValues.type.length > 0) {
            newData = newData.filter(item => filterValues.type.includes(item.type.toLowerCase())
            );
        }

        // Filter by status if selected
        if (filterValues.reqStatus && filterValues.reqStatus.length > 0) {
            newData = newData.filter(item => filterValues.reqStatus.includes(item.reqStatus));
        }

        // Sort by empName or itemName or date
        if (filterValues.sortBy === "empName") {
            newData.sort((a, b) => {
                const sortOrder = filterValues.order === "asc" ? 1 : -1;
                return a.empName.localeCompare(b.empName) * sortOrder;
            });
        } else if (filterValues.sortBy === "itemName") {
            newData.sort((a, b) => {
                const sortOrder = filterValues.order === "asc" ? 1 : -1;
                return a.itemName.localeCompare(b.itemName) * sortOrder;
            });
        } else if (filterValues.sortBy === "reqDate") {
            newData.sort((a, b) => {
                const sortOrder = filterValues.order === "asc" ? 1 : -1;
                return a.reqDate.localeCompare(b.reqDate) * sortOrder;
            });
        }

        setFilteredData(newData);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // for request status formatting
    function formatStatus(reqStatus: string) {
        switch (reqStatus) {
            case "returned":
                return "Returned";
            case "not-returned":
                return "Not Returned";
            case "consumed":
                return "Consumed";
            default:
                return reqStatus;
        }
    }

    // for the modals of add, view, edit, and delete
    const openModal = (mode: "add-request" | "view-request" | "edit-request" | "delete-request", rowData?: any) => {
        let content;

        switch (mode) {
            case "add-request":
                content = <AddRequestModal
                    onSave={handleAddRequest}
                    onClose={closeModal}
                />;
                break;
            case "view-request":
                content = <ViewRequestModal
                    item={rowData}
                    formatStatus={formatStatus}
                    onClose={closeModal}
                />;
                break;
            case "edit-request":
                content = <EditRequestModal
                    item={rowData}
                    onSave={handleEditRequest}
                    onClose={closeModal}
                />;
                break;
            case "delete-request":
                handleDeleteRequest(rowData);
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

    // Handle add request
    const handleAddRequest = (requestForms: RequestForm[]) => {
        console.log("Saving forms:", requestForms);
        // Logic to add multiple item requests to the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    // Handle edit requests
    const handleEditRequest = (updatedItem: any) => {
        console.log("Updating item:", updatedItem);
        // Logic to update the item in the data
        // In a real app, this would likely be an API call
        closeModal();
    };

    // Handle delete requests
    const handleDeleteRequest = async (rowData: any) => {
        const result = await showRequestDeleteConfirmation(rowData.itemName);

        if (result.isConfirmed) {
            await showRequestDeletedSuccess();
            console.log("Deleted row with id:", rowData.id);
            // Logic to delete the item from the data
            // In a real app, this would likely be an API call
        }
    };

    return (
        <div className="card">
            <h1 className="title">Request Management</h1>

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

                    {/* Add Request Button */}
                    <button className="main-btn" onClick={() => openModal("add-request")}>
                        <i className="ri-add-line" /> Add Request
                    </button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="data-table">
                            <thead className="table-heading">
                                <tr>
                                    <th>Employee Name</th>
                                    <th>Request Type</th>
                                    <th>Item Name</th>
                                    <th>Status</th>
                                    <th>Request Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {paginatedData.map(item => (
                                    <tr
                                        key={item.id}
                                        className={selectedIds.includes(item.id) ? "selected" : ""}
                                    >
                                        <td>{item.empName}</td>
                                        <td>{item.type}</td>
                                        <td>{item.itemName}</td>
                                        <td>
                                            <span className={`chip ${item.reqStatus}`}>
                                                {formatStatus(item.reqStatus)}
                                            </span>
                                        </td>
                                        <td>{item.reqDate}</td>
                                        <td>
                                            <ActionButtons
                                                onView={() => openModal("view-request", item)}
                                                onEdit={() => openModal("edit-request", item)}
                                                onDelete={() => openModal("delete-request", item)}
                                                disableEdit={item.reqStatus !== "not-returned"}
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