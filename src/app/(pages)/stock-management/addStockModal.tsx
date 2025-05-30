import React, { useState, useEffect } from "react";

import {
	showStockSaveConfirmation, showStockSavedSuccess,
	showCloseWithoutSavingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

// Export the interface so it can be imported by other components
export interface StockForm {
	name: string,
	quantity: number,
	unit: string,
	reorder: number,
	usable: number,
	defective: number,
	missing: number,
	category: string,
	status: string,
	expiration: string,
}

interface FormError {
	[key: string]: string;
}

interface AddStockModalProps {
	onSave: (stockForms: StockForm[]) => void;
	onClose: () => void;
}

export default function AddStockModal({ onSave, onClose }: AddStockModalProps) {
	// Initial stock form state
	const initialFormState: StockForm = {
		name: "",
		quantity: 10,
		unit: "",
		reorder: 0,
		usable: 0,
		defective: 0,
		missing: 0,
		category: "",
		status: "available",
		expiration: "",
	};

	const [stockForms, setStockForms] = useState<StockForm[]>([initialFormState]);
	const [formErrors, setFormErrors] = useState<FormError[]>([{}]);
	const [isDirty, setIsDirty] = useState(false);

	// Track if any form has been modified
	useEffect(() => {
		setIsDirty(true);
	}, [stockForms]);

	const handleFormChange = (index: number, field: string, value: any) => {
		setStockForms((prev) =>
			prev.map((form, i) =>
				i === index ? { ...form, [field]: value } : form
			)
		);

		// Clear errors for the changed field
		if (formErrors[index] && formErrors[index][field]) {
			const newErrors = [...formErrors];
			delete newErrors[index][field];

			// Also clear sum error if quantity-related fields are changed
			if (["usable", "defective", "missing", "quantity"].includes(field)) {
				delete newErrors[index]["sum"];
			}

			setFormErrors(newErrors);
		}
	};

	const handleAddAnotherStock = () => {
		setStockForms((prev) => [...prev, initialFormState]);
		setFormErrors((prev) => [...prev, {}]);
	};

	const handleRemoveStock = (index: number) => {
		setStockForms((prev) => prev.filter((_, i) => i !== index));
		setFormErrors((prev) => prev.filter((_, i) => i !== index));
	};

	const validateForm = (): boolean => {
		const errors = stockForms.map((form) => {
			const errorObj: FormError = {};

			if (!form.name) errorObj.name = "Item name is required";
			if (form.reorder < 0) errorObj.reorder = "Reorder level must be 0 or more";
			if (form.reorder > form.quantity) errorObj.reorder = "Reorder level cannot exceed total quantity";
			if (!form.category) errorObj.category = "Item category is required";

			const sum = form.usable + form.defective + form.missing;
			if (sum !== form.quantity) {
				errorObj.sum = "The combined total of usable, defective, and missing must equal the total quantity";
			}

			if (form.expiration) {
				const today = new Date();
				const selectedDate = new Date(form.expiration);
				today.setHours(0, 0, 0, 0);
				selectedDate.setHours(0, 0, 0, 0);
				if (selectedDate < today) {
					errorObj.expiration = "Expiration date cannot be in the past";
				}
			}

			return errorObj;
		});

		setFormErrors(errors);
		return errors.every((err) => Object.keys(err).length === 0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		const result = await showStockSaveConfirmation(stockForms.length);
		if (result.isConfirmed) {
			onSave(stockForms);
			await showStockSavedSuccess(stockForms.length);
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
				<h1 className="modal-title">Add Stock</h1>
				<div className="modal-date-time">
					<p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
					<p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
				</div>

				<button className="close-modal-btn" onClick={handleClose}>
					<i className="ri-close-line"></i>
				</button>
			</div>

			{/* Add Stock Form - allows adding multiple stocks */}
			{stockForms.map((form, index) => (
				<div className="modal-content add" key={index}>
					<form className="add-stock-form" id={`add-stock-form-${index}`}>
						{/* Item Name */}
						<div className="form-group">
							<label>Item Name</label>
							<select
								className={formErrors[index]?.name ? "invalid-input" : ""}
								value={form.name}
								onChange={(e) => handleFormChange(index, "name", e.target.value)}
							>
								<option value="" disabled>Select an item...</option>
								<option value="1">Item 1</option>
								<option value="2">Item 2</option>
								<option value="3">Item 3</option>
								<option value="4">Item 4</option>
								<option value="5">Item 5</option>
							</select>
							<p className="add-error-message">{formErrors[index]?.name}</p>
						</div>

						<div className="form-row">
							{/* Quantity */}
							<div className="form-group">
								<label>Total Quantity</label>
								<input disabled
									type="number"
									step="0.1"
									min="0"
									value={form.quantity}
								/>
							</div>

							{/* Unit Measure */}
							<div className="form-group">
								<label>Unit Measure</label>
								<select disabled value={form.unit}>
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
									className={formErrors[index]?.reorder ? "invalid-input" : ""}
									type="number"
									step="0.1"
									min="0"
									value={form.reorder}
									onChange={(e) => handleFormChange(index, "reorder", Number(e.target.value))}
								/>
								<p className="add-error-message">{formErrors[index]?.reorder}</p>
							</div>
						</div>

						<div className="form-row">
							{/* Usable */}
							<div className="form-group">
								<label>Usable Quantity</label>
								<input
									className={formErrors[index]?.usable ? "invalid-input" : ""}
									type="number"
									step="0.1"
									min="0"
									value={form.usable}
									onChange={(e) => handleFormChange(index, "usable", Number(e.target.value))}
								/>
							</div>

							{/* Defective */}
							<div className="form-group">
								<label>Defective Quantity</label>
								<input
									className={formErrors[index]?.defective ? "invalid-input" : ""}
									type="number"
									step="0.1"
									min="0"
									value={form.defective}
									onChange={(e) => handleFormChange(index, "defective", Number(e.target.value))}
								/>
							</div>

							{/* Missing */}
							<div className="form-group">
								<label>Missing Quantity</label>
								<input
									className={formErrors[index]?.missing ? "invalid-input" : ""}
									type="number"
									step="0.1"
									min="0"
									value={form.missing}
									onChange={(e) => handleFormChange(index, "missing", Number(e.target.value))}
								/>
							</div>
						</div>

						{/* Sum Error */}
						<div className="form-group">
							{formErrors[index]?.sum && <p className="add-error-message quantity">{formErrors[index].sum}</p>}
						</div>

						<div className="form-row">
							{/* Category */}
							<div className="form-group">
								<label>Category</label>
								<select
									className={formErrors[index]?.category ? "invalid-input" : ""}
									value={form.category}
									onChange={(e) => handleFormChange(index, "category", e.target.value)}
								>
									<option value="" disabled>Select category...</option>
									<option value="consumable">Consumable</option>
									<option value="mach-equip">Machine/Equipment</option>
								</select>
								<p className="add-error-message">{formErrors[index]?.category}</p>
							</div>

							{/* Status */}
							<div className="form-group">
								<label>Status</label>
								<select disabled value={form.status}>
									<option value="available">Available</option>
									<option value="out-of-stock">Out of Stock</option>
									<option value="low-stock">Low Stock</option>
									<option value="maintenance">Under Maintenance</option>
								</select>
							</div>
						</div>

						{/* Expiration */}
						{form.category === "consumable" && (
							<div className="form-group">
								<label>Expiration Date</label>
								<input
									className={formErrors[index]?.expiration ? "invalid-input" : ""}
									type="date"
									value={form.expiration}
									onChange={(e) => handleFormChange(index, "expiration", e.target.value)}
								/>
								<p className="add-error-message">{formErrors[index]?.expiration}</p>
							</div>
						)}

					</form>

					{/* Remove Stock Button - Only show if there's more than one form */}
					{stockForms.length > 1 && (
						<div className="remove-btn-wrapper">
							<button
								type="button"
								className="remove-stock-btn"
								onClick={() => handleRemoveStock(index)}
							>
								<i className="ri-close-line" /> Remove
							</button>
						</div>
					)}
				</div>
			))}

			<div className="modal-actions add">
				<button type="button" className="add-another-btn" onClick={handleAddAnotherStock}>
					<i className="ri-add-line" /> Add Another Stock
				</button>

				<button type="submit" className="submit-btn" onClick={handleSubmit}>
					<i className="ri-save-3-line" /> Save
				</button>
			</div>

		</>
	);
}