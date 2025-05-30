import React, { useState, useEffect } from "react";

import {
    showBusUpdateConfirmation, showBusUpdatedSuccess,
    showCloseWithoutUpdatingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

interface EditBusModalProps {
    item: {
        id: number;
        bodyNumber: string,
        bodyBuilder: string,
        busType: string,
        busStatus: string,
        route: string,
        // Additional fields would be included in a real application
    };
    onSave: (updatedItem: any) => void;
    onClose: () => void;
}

export default function EditBusModal({ item, onSave, onClose }: EditBusModalProps) {
    const [formData, setFormData] = useState({
        id: item.id,
        plateNumber: "",
        bodyNumber: item.bodyNumber,
        bodyBuilder: item.bodyBuilder,
        busType: item.busType,
        busStatus: item.busStatus,
        manufacturer: "",
        seatCapacity: 0,
        chasisNumber: "",
        engineNumber: "",
        route: item.route,
        purchasePrice: 0,
        purchaseDate: "",
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

        // Validate status and route
        if (!formData.busStatus) errors.busStatus = "Bus status is required";
        if (!formData.route) errors.route = "Route is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await showBusUpdateConfirmation(formData.bodyNumber);
        if (result.isConfirmed) {
            onSave(formData);
            await showBusUpdatedSuccess();
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
                <h1 className="modal-title">Edit Bus</h1>
                <div className="modal-date-time">
                    <p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    <p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
                </div>

                <button className="close-modal-btn" onClick={handleClose}>
                    <i className="ri-close-line"></i>
                </button>
            </div>

            {/* Edit Bus Form */}
            <div className="modal-content edit">
                <form className="edit-bus-form" id="edit-bus-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        {/* Plate Number */}
                        <div className="form-group">
                            <label>Plate Number</label>
                            <input disabled
                                className={formErrors?.plateNumber ? "invalid-input" : ""}
                                type="text"
                                value={formData.plateNumber}
                                onChange={(e) => handleChange("plateNumber", e.target.value)}
                                placeholder="Enter plate number here..."
                            />
                            <p className="edit-error-message">{formErrors?.plateNumber}</p>
                        </div>

                        {/* Body Number */}
                        <div className="form-group">
                            <label>Body Number</label>
                            <input disabled
                                className={formErrors?.bodyNumber ? "invalid-input" : ""}
                                type="text"
                                value={formData.bodyNumber}
                                onChange={(e) => handleChange("bodyNumber", e.target.value)}
                                placeholder="Enter body number here..."
                            />
                            <p className="edit-error-message">{formErrors?.bodyNumber}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Body Builder */}
                        <div className="form-group">
                            <label>Body Builder</label>
                            <select disabled
                                className={formErrors?.bodyBuilder ? "invalid-input" : ""}
                                value={formData.bodyBuilder}
                                onChange={(e) => handleChange("bodyBuilder", e.target.value)}
                            >
                                <option value="" disabled>Select body builder...</option>
                                <option value="agila">Agila</option>
                                <option value="hilltop">Hilltop</option>
                                <option value="rbm">RBM</option>
                                <option value="darj">DARJ</option>
                            </select>
                            <p className="edit-error-message">{formErrors?.bodyBuilder}</p>
                        </div>

                        {/* Bus Type */}
                        <div className="form-group">
                            <label>Bus Type</label>
                            <select disabled
                                className={formErrors?.busType ? "invalid-input" : ""}
                                value={formData.busType}
                                onChange={(e) => handleChange("busType", e.target.value)}
                            >
                                <option value="" disabled>Select bus type...</option>
                                <option value="airconditioned">Airconditioned</option>
                                <option value="ordinary">Ordinary</option>
                            </select>
                            <p className="edit-error-message">{formErrors?.busType}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Manufacturer */}
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <input disabled
                                className={formErrors?.manufacturer ? "invalid-input" : ""}
                                type="text"
                                value={formData.manufacturer}
                                onChange={(e) => handleChange("manufacturer", e.target.value)}
                                placeholder="Enter manufacturer here..."
                            />
                            <p className="edit-error-message">{formErrors?.manufacturer}</p>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className={formErrors?.busStatus ? "invalid-input" : ""}
                                value={formData.busStatus}
                                onChange={(e) => handleChange("busStatus", e.target.value)}
                            >
                                <option value="" disabled>Select status...</option>
                                <option value="active">Active</option>
                                <option value="decommissioned">Decommissioned</option>
                                <option value="under-maintenance">Under Maintenance</option>
                            </select>
                            <p className="edit-error-message">{formErrors?.busStatus}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Chasis Number */}
                        <div className="form-group">
                            <label>Chasis Number</label>
                            <input disabled
                                className={formErrors?.chasisNumber ? "invalid-input" : ""}
                                type="text"
                                value={formData.chasisNumber}
                                onChange={(e) => handleChange("chasisNumber", e.target.value)}
                                placeholder="Enter chasis number here..."
                            />
                            <p className="edit-error-message">{formErrors?.chasisNumber}</p>
                        </div>

                        {/* Engine Number */}
                        <div className="form-group">
                            <label>Engine Number</label>
                            <input disabled
                                className={formErrors?.engineNumber ? "invalid-input" : ""}
                                type="text"
                                value={formData.engineNumber}
                                onChange={(e) => handleChange("engineNumber", e.target.value)}
                                placeholder="Enter engine number here..."
                            />
                            <p className="edit-error-message">{formErrors?.engineNumber}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Seat Capacity */}
                        <div className="form-group">
                            <label>Seat Capacity</label>
                            <input disabled
                                className={formErrors?.seatCapacity ? "invalid-input" : ""}
                                type="number"
                                step="1"
                                min="0"
                                value={formData.seatCapacity}
                                onChange={(e) => handleChange("seatCapacity", Number(e.target.value))}
                            />
                            <p className="edit-error-message">{formErrors?.seatCapacity}</p>
                        </div>

                        {/* Purchase Price */}
                        <div className="form-group">
                            <label>Purchase Price</label>
                            <input disabled
                                className={formErrors?.purchasePrice ? "invalid-input" : ""}
                                type="number"
                                step="0.1"
                                min="0"
                                value={formData.purchasePrice}
                                onChange={(e) => handleChange("purchasePrice", Number(e.target.value))}
                            />
                            <p className="edit-error-message">{formErrors?.purchasePrice}</p>
                        </div>

                        {/* Purchase Date */}
                        <div className="form-group">
                            <label>Purchase Date</label>
                            <input disabled
                                className={formErrors?.purchaseDate ? "invalid-input" : ""}
                                type="date"
                                value={formData.purchaseDate}
                                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                            />
                            <p className="edit-error-message">{formErrors?.purchaseDate}</p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="form-group">
                        <label>Route</label>
                        <select
                            className={formErrors?.route ? "invalid-input" : ""}
                            value={formData.route}
                            onChange={(e) => handleChange("route", e.target.value)}
                        >
                            <option value="" disabled>Select route...</option>
                            <option value="sapang palay - pitx">Sapang Palay - PITX</option>
                            <option value="sapang palay - santa cruz">Sapang Palay - Santa Cruz</option>
                        </select>
                        <p className="edit-error-message">{formErrors?.route}</p>
                    </div>
                </form>
            </div>

            <div className="modal-actions">
                <button type="submit" className="submit-btn" form="edit-bus-form">
                    <i className="ri-save-3-line" /> Update
                </button>
            </div>

        </>
    );
}