import React, { useState, useEffect } from "react";

import {
	showStockUpdateConfirmation, showStockUpdatedSuccess,
	showCloseWithoutUpdatingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

interface EditStockModalProps {
	item: {
		id: string;
		item_id: string; // Added item_id to match API expectation
		item_name: string;
		current_stock: number;
		unit_measure: string;
		status: string;
		reorder_level: number;
		category_id: string;
		category: {
			category_id: string;
			category_name: string;
		};
		// Additional fields would be included in a real application
	};
	onSave: (updatedItem: any) => void;
	onClose: () => void;
}

export default function EditStockModal({ item, onSave, onClose }: EditStockModalProps) {
	// Helper function to convert database status to form display value
	const formatStatusForDisplay = (dbStatus: string) => {
		const statusMap: Record<string, string> = {
			'AVAILABLE': 'available',
			'LOW_STOCK': 'low_stock',
			'OUT_OF_STOCK': 'out_of_stock',
			'UNDER_MAINTENANCE': 'under_maintenance',
			'EXPIRED': 'expired'
		};
		return statusMap[dbStatus] || dbStatus.toLowerCase();
	};

	// Helper function to convert form display value to database format
	const formatStatusForDatabase = (displayStatus: string) => {
		const statusMap: Record<string, string> = {
			'available': 'AVAILABLE',
			'low_stock': 'LOW_STOCK',
			'out_of_stock': 'OUT_OF_STOCK',
			'under_maintenance': 'UNDER_MAINTENANCE',
			'expired': 'EXPIRED'
		};
		return statusMap[displayStatus] || displayStatus.toUpperCase();
	};

	const [formData, setFormData] = useState({
		id: item.id,
		item_id: item.item_id, // Added for API compatibility
		name: item.item_name,
		quantity: item.current_stock,
		unit: item.unit_measure,
		reorder: item.reorder_level,
		category: item.category.category_name,
		status: formatStatusForDisplay(item.status), // Convert from DB format to display format
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
		if (formData.reorder >= formData.quantity) errors.reorder = "Reorder level must be lower than total quantity";

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		// Debug logging
		console.log('Form data item_id:', formData.item_id);
		console.log('Original item:', item);

		const result = await showStockUpdateConfirmation(formData.name);
		if (result.isConfirmed) {
			try {
				// Format data to match API expectations
				const updateData = {
					item_id: formData.item_id,
					reorder_level: formData.reorder,
					status: formatStatusForDatabase(formData.status)
				};
				
				console.log('Sending update data:', updateData);

				// Make the API call to update the item
				const response = await fetch('/api/item', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updateData),
				});

				const responseData = await response.json();
				console.log('API response:', responseData);

				if (response.ok && responseData.success) {
					// Call onSave to update the parent component's state
					onSave(responseData.item);
					await showStockUpdatedSuccess();
					onClose(); // Close the modal after successful update
					window.location.reload();
				} else {
					console.error('Update failed:', responseData.error);
					// You might want to show an error message to the user here
					alert(`Update failed: ${responseData.error || 'Unknown error'}`);
				}
			} catch (error) {
				console.error('Error updating item:', error);
				alert('Failed to update item. Please try again.');
			}
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

	// Check if status should be disabled based on category
	const isStatusDisabled = formData.category.toLowerCase() === "consumable";

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
							<input disabled
								type="text"
								value={formData.unit}
								onChange={(e) => handleChange("unit", e.target.value)}
							/>
						</div>

						{/* Reorder Level */}
						<div className="form-group">
							<label>Reorder Level</label>
							<input
								className={formErrors?.reorder ? "invalid-input" : ""}
								type="number"
								step="1"
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
							<input disabled
								type="text"
								value={formData.category}
								onChange={(e) => handleChange("category", e.target.value)}
							/>
						</div>

						{/* Status */}
						<div className="form-group">
							<label>Status</label>
							<select
								disabled={isStatusDisabled}
								value={formData.status}
								onChange={(e) => handleChange("status", e.target.value)}
							>
								<option value="available">Available</option>
								<option value="under_maintenance">Under Maintenance</option>
							</select>
							{isStatusDisabled}
						</div>
					</div>

					{/* Expiration Date */}
					{/* {formData.category === "consumable" && ( */}
					{/* <div className="form-group expiration">
						<label>Expiration Date</label>
						<input disabled
							type="date"
							value={formData.expiration}
							onChange={(e) => handleChange("expiration", e.target.value)}
						/>
					</div> */}
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