import React, { useState, useEffect } from "react";

import {
	showStockUpdateConfirmation, showStockUpdatedSuccess,
	showCloseWithoutUpdatingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

interface EditStockModalProps {
	item: {
		id: number;
		name: string;
		quantity: number;
		unit: string;
		status: string;
		reorder: number;
		// Additional fields would be included in a real application
	};
	onSave: (updatedItem: any) => void;
	onClose: () => void;
}

export default function EditStockModal({ item, onSave, onClose }: EditStockModalProps) {
	const [formData, setFormData] = useState({
		id: item.id,
		name: item.name,
		quantity: item.quantity,
		unit: item.unit,
		reorder: item.reorder,
		category: "", // Default value, would be populated from item in a real app
		status: item.status,
		expiration: "" // Default value, would be populated from item in a real app
	});

	// State to track if form is dirty (has changes)
	const [isFormDirty, setIsFormDirty] = useState(false);
	const [originalData] = useState({ ...formData });

	// Add formErrors state similar to AddStockModal
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

		// Validate reorder level
		if (formData.reorder < 0) errors.reorder = "Reorder level must be 0 or more";
		if (formData.reorder > formData.quantity) errors.reorder = "Reorder level cannot exceed total quantity";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		const result = await showStockUpdateConfirmation(formData.name);
		if (result.isConfirmed) {
			onSave(formData);
			await showStockUpdatedSuccess();
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
				<h1 className="modal-title">Edit Stock</h1>
				<div className="modal-date-time">
					<p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
					<p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
				</div>

				<button className="close-modal-btn" onClick={handleClose}>
					<i className="ri-close-line"></i>
				</button>
			</div>

			{/* Edit Stock Form */}
			<div className="modal-content edit">
				<form className="edit-stock-form" id="edit-stock-form" onSubmit={handleSubmit}>
					{/* Item Name */}
					<div className="form-group">
						<label>Item Name</label>
						<input disabled
							className={formErrors?.name ? "invalid-input" : ""}
							type="text"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
						<p className="edit-error-message"></p>
					</div>

					<div className="form-row">
						{/* Quantity */}
						<div className="form-group">
							<label>Quantity</label>
							<input disabled
								type="number"
								min="0"
								value={formData.quantity}
								onChange={(e) => handleChange("quantity", Number(e.target.value))}
							/>
						</div>

						{/* Unit Measure */}
						<div className="form-group">
							<label>Unit Measure</label>
							<select disabled
								value={formData.unit}
								onChange={(e) => handleChange("unit", e.target.value)}
							>
								<option value="pcs">pcs (pieces)</option>
								<option value="kg">kg (kilograms)</option>
								<option value="l">L (liters)</option>
								<option value="m">m (meters)</option>
								<option value="box">box/es</option>
								<option value="pack">pack/s</option>
								<option value="roll">roll/s</option>
							</select>
						</div>

						{/* Reorder Level */}
						<div className="form-group">
							<label>Reorder Level</label>
							<input
								className={formErrors?.reorder ? "invalid-input" : ""}
								type="number"
								step="0.1"
								min="0"
								value={formData.reorder}
								onChange={(e) => handleChange("reorder", Number(e.target.value))}
							/>
							<p className="edit-error-message">{formErrors?.reorder}</p>
						</div>
					</div>

					<div className="form-row">
						{/* Category */}
						<div className="form-group category">
							<label>Category</label>
							<select disabled
								value={formData.category}
								onChange={(e) => handleChange("category", e.target.value)}
							>
								<option value="consumable">Consumable</option>
								<option value="mach-equip">Machine/Equipment</option>
							</select>
						</div>

						{/* Status */}
						<div className="form-group">
							<label>Status</label>
							<select
								value={formData.status}
								onChange={(e) => handleChange("status", e.target.value)}
							>
								<option value="available">Available</option>
								<option value="maintenance">Under Maintenance</option>
							</select>
						</div>
					</div>

					{/* Expiration Date */}
					{/* {formData.category === "consumable" && ( */}
					<div className="form-group expiration">
						<label>Expiration Date</label>
						<input disabled
							type="date"
							value={formData.expiration}
							onChange={(e) => handleChange("expiration", e.target.value)}
						/>
					</div>
					{/* )} */}

				</form>
			</div>

			<div className="modal-actions">
				<button type="submit" className="submit-btn" form="edit-stock-form">
					<i className="ri-save-3-line" /> Update
				</button>
			</div>

		</>
	);
}