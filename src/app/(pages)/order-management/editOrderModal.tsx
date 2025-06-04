import React, { useState, useEffect } from "react";

import {
    showOrderUpdateConfirmation, showOrderUpdatedSuccess,
    showCloseWithoutUpdatingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

interface EditOrderModalProps {
    item: {
        id: number;
        itemName: string;
        ordQuantity: number,
        ordReqDate: string,
        ordStatus: string,
        // Additional fields would be included in a real application
    };
    onSave: (updatedItem: any) => void;
    onClose: () => void;
}

export default function EditOrderModal({ item, onSave, onClose }: EditOrderModalProps) {
    const [formData, setFormData] = useState({
        id: item.id,
        itemName: item.itemName,
        ordQuantity: item.ordQuantity,
        ordStatus: item.ordStatus,
        ordReason: ""
    });

    // State to track if form is dirty (has changes)
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [originalData] = useState({ ...formData });

    // Add formErrors state
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Check if form data has changed from original
    useEffect(() => {
        const hasChanges = JSON.stringify(originalData) !== JSON.stringify(formData);
        setIsFormDirty(hasChanges);
    }, [formData, originalData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate status
        if (!formData.ordStatus) errors.ordStatus = "Order status is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await showOrderUpdateConfirmation(formData.itemName);
        if (result.isConfirmed) {
            onSave(formData);
            await showOrderUpdatedSuccess();
        }
    };

    const handleClose = async () => {
        if (!isFormDirty) {
            onClose();
            return;
        }

        const result = await showCloseWithoutUpdatingConfirmation();
        if (result.isConfirmed) {
            onClose();
        }
    };

    return (
        <>
            <div className="modal-heading">
                <h1 className="modal-title">Edit Request</h1>
                <div className="modal-date-time">
                    <p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    <p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
                </div>

                <button className="close-modal-btn" onClick={handleClose}>
                    <i className="ri-close-line"></i>
                </button>
            </div>

            {/* Edit Order Form */}
            <div className="modal-content edit">
                <form className="edit-order-form" id="edit-order-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-column">
                            {/* Item Name */}
                            <div className="form-group">
                                <label>Item Name</label>
                                <input disabled
                                    className={formErrors?.itemName ? "invalid-input" : ""}
                                    type="text"
                                    value={formData.itemName}
                                    onChange={(e) => handleChange("itemName", e.target.value)}
                                />
                                <p className="edit-error-message"></p>
                            </div>

                            {/* Quantity */}
                            <div className="form-group">
                                <label>Quantity</label>
                                <input disabled
                                    className={formErrors?.ordQuantity ? "invalid-input" : ""}
                                    type="number"
                                    min="0"
                                    value={formData.ordQuantity}
                                    onChange={(e) => handleChange("ordQuantity", Number(e.target.value))}
                                />
                                <p className="add-error-message"></p>
                            </div>

                            {/* Status */}
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    className={formErrors?.ordStatus ? "invalid-input" : ""}
                                    value={formData.ordStatus}
                                    onChange={(e) => handleChange("ordStatus", e.target.value)}
                                >
                                    <option value="" disabled>Select status...</option>
                                    <option value="completed">Completed</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <p className="add-error-message">{formErrors?.ordStatus}</p>
                            </div>
                        </div>

                        {/* Request Reason */}
                        <div className="form-group">
                            <label>Reason for Order Request</label>
                            <textarea disabled
                                className={`order ${formErrors?.ordReason ? "invalid-input" : ""}`}
                                value={formData.ordReason}
                                onChange={(e) => handleChange("ordReason", e.target.value)}
                            >
                            </textarea>
                            <p className="add-error-message">{formErrors?.ordReason}</p>
                        </div>
                    </div>
                </form>
            </div>

            <div className="modal-actions">
                <button type="submit" className="submit-btn" form="edit-order-form">
                    <i className="ri-save-3-line" /> Update
                </button>
            </div>

        </>
    );
}