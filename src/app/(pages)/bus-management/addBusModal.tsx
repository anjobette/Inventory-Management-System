import React, { useState, useEffect } from "react";

import {
    showBusSaveConfirmation, showBusSavedSuccess,
    showCloseWithoutSavingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

// Export the interface so it can be imported by other components
export interface BusForm {
    plateNumber: string,
    bodyNumber: string,
    bodyBuilder: string,
    busType: string,
    busStatus: string,
    manufacturer: string,
    seatCapacity: number,
    chasisNumber: string,
    engineNumber: string,
    route: string,
    purchasePrice: number,
    purchaseDate: string,
}

interface FormError {
    [key: string]: string;
}

interface AddBusModalProps {
    onSave: (busForm: BusForm) => void;
    onClose: () => void;
}

export default function AddBusModal({ onSave, onClose }: AddBusModalProps) {
    // Initial bus form state
    const [busForm, setBusForm] = useState<BusForm>({
        plateNumber: "",
        bodyNumber: "",
        bodyBuilder: "",
        busType: "",
        busStatus: "active",
        manufacturer: "",
        seatCapacity: 0,
        chasisNumber: "",
        engineNumber: "",
        route: "",
        purchasePrice: 0,
        purchaseDate: "",
    });

    const [formErrors, setFormErrors] = useState<FormError>({});
    const [isDirty, setIsDirty] = useState(false);

    // Track if any form has been modified
    useEffect(() => {
        setIsDirty(true);
    }, [busForm]);

    const handleChange = (field: string, value: any) => {
        setBusForm((prev) => ({ ...prev, [field]: value }));

        // Clear the error for that field
        if (formErrors[field]) {
            const newErrors = { ...formErrors };
            delete newErrors[field];
            setFormErrors(newErrors);
        }
    };

    const validateForm = (): boolean => {
        const errors: FormError = {};

        if (!busForm.plateNumber) errors.plateNumber = "Plate number is required";
        if (!busForm.bodyNumber) errors.bodyNumber = "Body number is required";
        if (!busForm.bodyBuilder) errors.bodyBuilder = "Body builder is required";
        if (!busForm.busType) errors.busType = "Bus type is required";
        if (!busForm.manufacturer) errors.manufacturer = "Manufacturer is required";
        if (busForm.seatCapacity <= 0) errors.seatCapacity = "Seat capacity must be more than 0";
        if (!busForm.chasisNumber) errors.chasisNumber = "Chasis number is required";
        if (!busForm.engineNumber) errors.engineNumber = "Engine number is required";
        if (!busForm.route) errors.route = "Route is required";
        if (busForm.purchasePrice <= 0) errors.purchasePrice = "Purchase price must be more than 0";

        if (!busForm.purchaseDate) {
            errors.purchaseDate = "Purchase date is required";
        } else {
            const today = new Date();
            const selectedDate = new Date(busForm.purchaseDate);
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                errors.purchaseDate = "Purchase date cannot be set to a future date";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await showBusSaveConfirmation();
        if (result.isConfirmed) {
            onSave(busForm);
            await showBusSavedSuccess();
        }
    };

    const handleClose = async () => {
        if (!isDirty) {
            onClose();
            return;
        }

        const result = await showCloseWithoutSavingConfirmation();
        if (result.isConfirmed) {
            onClose();
        }
    };

    return (
        <>
            <div className="modal-heading">
                <h1 className="modal-title">Add Bus</h1>
                <div className="modal-date-time">
                    <p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    <p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
                </div>

                <button className="close-modal-btn" onClick={handleClose}>
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="modal-content add">
                <form className="add-bus-form">
                    <div className="form-row">
                        {/* Plate Number */}
                        <div className="form-group">
                            <label>Plate Number</label>
                            <input
                                className={formErrors?.plateNumber ? "invalid-input" : ""}
                                type="text"
                                value={busForm.plateNumber}
                                onChange={(e) => handleChange("plateNumber", e.target.value)}
                                placeholder="Enter plate number here..."
                            />
                            <p className="add-error-message">{formErrors?.plateNumber}</p>
                        </div>

                        {/* Body Number */}
                        <div className="form-group">
                            <label>Body Number</label>
                            <input
                                className={formErrors?.bodyNumber ? "invalid-input" : ""}
                                type="text"
                                value={busForm.bodyNumber}
                                onChange={(e) => handleChange("bodyNumber", e.target.value)}
                                placeholder="Enter body number here..."
                            />
                            <p className="add-error-message">{formErrors?.bodyNumber}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Body Builder */}
                        <div className="form-group">
                            <label>Body Builder</label>
                            <select
                                className={formErrors?.bodyBuilder ? "invalid-input" : ""}
                                value={busForm.bodyBuilder}
                                onChange={(e) => handleChange("bodyBuilder", e.target.value)}
                            >
                                <option value="" disabled>Select body builder...</option>
                                <option value="agila">Agila</option>
                                <option value="hilltop">Hilltop</option>
                                <option value="rbm">RBM</option>
                                <option value="darj">DARJ</option>
                            </select>
                            <p className="add-error-message">{formErrors?.bodyBuilder}</p>
                        </div>

                        {/* Bus Type */}
                        <div className="form-group">
                            <label>Bus Type</label>
                            <select
                                className={formErrors?.busType ? "invalid-input" : ""}
                                value={busForm.busType}
                                onChange={(e) => handleChange("busType", e.target.value)}
                            >
                                <option value="" disabled>Select bus type...</option>
                                <option value="airconditioned">Airconditioned</option>
                                <option value="ordinary">Ordinary</option>
                            </select>
                            <p className="add-error-message">{formErrors?.busType}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Manufacturer */}
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <input
                                className={formErrors?.manufacturer ? "invalid-input" : ""}
                                type="text"
                                value={busForm.manufacturer}
                                onChange={(e) => handleChange("manufacturer", e.target.value)}
                                placeholder="Enter manufacturer here..."
                            />
                            <p className="add-error-message">{formErrors?.manufacturer}</p>
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>Status</label>
                            <select disabled value={busForm.busStatus}>
                                <option value="active">Active</option>
                                <option value="decommissioned">Decommissioned</option>
                                <option value="under-maintenance">Under Maintenance</option>
                            </select>
                            <p className="add-error-message">{formErrors?.busStatus}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Chasis Number */}
                        <div className="form-group">
                            <label>Chasis Number</label>
                            <input
                                className={formErrors?.chasisNumber ? "invalid-input" : ""}
                                type="text"
                                value={busForm.chasisNumber}
                                onChange={(e) => handleChange("chasisNumber", e.target.value)}
                                placeholder="Enter chasis number here..."
                            />
                            <p className="add-error-message">{formErrors?.chasisNumber}</p>
                        </div>

                        {/* Engine Number */}
                        <div className="form-group">
                            <label>Engine Number</label>
                            <input
                                className={formErrors?.engineNumber ? "invalid-input" : ""}
                                type="text"
                                value={busForm.engineNumber}
                                onChange={(e) => handleChange("engineNumber", e.target.value)}
                                placeholder="Enter engine number here..."
                            />
                            <p className="add-error-message">{formErrors?.engineNumber}</p>
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Seat Capacity */}
                        <div className="form-group">
                            <label>Seat Capacity</label>
                            <input
                                className={formErrors?.seatCapacity ? "invalid-input" : ""}
                                type="number"
                                step="1"
                                min="0"
                                value={busForm.seatCapacity}
                                onChange={(e) => handleChange("seatCapacity", Number(e.target.value))}
                            />
                            <p className="add-error-message">{formErrors?.seatCapacity}</p>
                        </div>

                        {/* Purchase Price */}
                        <div className="form-group">
                            <label>Purchase Price</label>
                            <input
                                className={formErrors?.purchasePrice ? "invalid-input" : ""}
                                type="number"
                                step="0.1"
                                min="0"
                                value={busForm.purchasePrice}
                                onChange={(e) => handleChange("purchasePrice", Number(e.target.value))}
                            />
                            <p className="add-error-message">{formErrors?.purchasePrice}</p>
                        </div>

                        {/* Purchase Date */}
                        <div className="form-group">
                            <label>Purchase Date</label>
                            <input
                                className={formErrors?.purchaseDate ? "invalid-input" : ""}
                                type="date"
                                value={busForm.purchaseDate}
                                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                            />
                            <p className="add-error-message">{formErrors?.purchaseDate}</p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="form-group">
                        <label>Route</label>
                        <select
                            className={formErrors?.route ? "invalid-input" : ""}
                            value={busForm.route}
                            onChange={(e) => handleChange("route", e.target.value)}
                        >
                            <option value="" disabled>Select route...</option>
                            <option value="sapang palay - pitx">Sapang Palay - PITX</option>
                            <option value="sapang palay - santa cruz">Sapang Palay - Santa Cruz</option>
                        </select>
                        <p className="add-error-message">{formErrors?.route}</p>
                    </div>
                </form>
            </div>

            <div className="modal-actions add">
                <button type="submit" className="submit-btn" onClick={handleSubmit}>
                    <i className="ri-save-3-line" /> Save
                </button>
            </div>

        </>
    );
}