import React, { useState, useEffect } from "react";

import {
	showRequestSaveConfirmation, showRequestSavedSuccess,
	showCloseWithoutSavingConfirmation
} from "@/utils/sweetAlert";

import "@/styles/forms.css";

// Export the interface so it can be imported by other components
export interface RequestForm {
	empName: string,
	type: string,
	reqStatus: string,
	itemName: string,
	reqQuantity: number,
	purpose: string,
	expectedDate: string,
}

interface FormError {
	[key: string]: string;
}

interface AddRequestModalProps {
	onSave: (RequestForms: RequestForm[]) => void;
	onClose: () => void;
}

export default function AddRequestModal({ onSave, onClose }: AddRequestModalProps) {
	// Initial request form state
	const initialFormState: RequestForm = {
		empName: "",
		type: "",
		reqStatus: "",
		itemName: "",
		reqQuantity: 0,
		purpose: "",
		expectedDate: "",
	};

	const [requestForms, setRequestForms] = useState<RequestForm[]>([initialFormState]);
	const [formErrors, setFormErrors] = useState<FormError[]>([{}]);
	const [isDirty, setIsDirty] = useState(false);

	// Track if any form has been modified
	useEffect(() => {
		setIsDirty(true);
	}, [requestForms]);

	const handleFormChange = (index: number, field: string, value: any) => {
		if (field === "empName") {
			// Update empName for all forms
			setRequestForms((prev) =>
				prev.map((form) => ({ ...form, empName: value }))
			);

			// Clear empName error in the first form (index 0)
			if (formErrors[0]?.empName) {
				const newErrors = [...formErrors];
				delete newErrors[0].empName;
				setFormErrors(newErrors);
			}
		} else if (field === "type") {
			// Clear reqStatus when type changes
			setRequestForms((prev) =>
				prev.map((form, i) =>
					i === index ? { ...form, [field]: value, reqStatus: "" } : form
				)
			);

			// Clear the error for that field
			if (formErrors[index]?.[field]) {
				const newErrors = [...formErrors];
				delete newErrors[index][field];
				setFormErrors(newErrors);
			}
		} else {
			// Update field for specific form
			setRequestForms((prev) =>
				prev.map((form, i) =>
					i === index ? { ...form, [field]: value } : form
				)
			);

			// Clear the error for that field
			if (formErrors[index]?.[field]) {
				const newErrors = [...formErrors];
				delete newErrors[index][field];
				setFormErrors(newErrors);
			}
		}
	};

	const handleAddAnotherRequest = () => {
		const empName = requestForms[0].empName; // Get empName from the first form
		const newForm = { ...initialFormState, empName }; // Copy empName into new form
		setRequestForms((prev) => [...prev, newForm]);
		setFormErrors((prev) => [...prev, {}]);
	};


	const handleRemoveRequest = (index: number) => {
		setRequestForms((prev) => prev.filter((_, i) => i !== index));
		setFormErrors((prev) => prev.filter((_, i) => i !== index));
	};

	const validateForm = (): boolean => {
		const errors = requestForms.map((form) => {
			const errorObj: FormError = {};

			if (!form.empName) errorObj.empName = "Employee name is required";
			if (!form.type) errorObj.type = "Request type is required";
			if (!form.reqStatus) errorObj.reqStatus = "Request status is required";
			if (!form.itemName) errorObj.itemName = "Item name is required";
			if (form.reqQuantity <= 0) errorObj.reqQuantity = "Quantity must be more than 0";
			if (!form.purpose) errorObj.purpose = "Request purpose is required";

			// Validate expectedDate only if type is "borrow"
			if (form.type === "borrow") {
				if (!form.expectedDate) {
					errorObj.expectedDate = "Expected return date is required";
				} else {
					const today = new Date();
					const selectedDate = new Date(form.expectedDate);
					today.setHours(0, 0, 0, 0);
					selectedDate.setHours(0, 0, 0, 0);
					if (selectedDate < today) {
						errorObj.expectedDate = "Expected return date cannot be in the past";
					}
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

		const result = await showRequestSaveConfirmation(requestForms.length);
		if (result.isConfirmed) {
			onSave(requestForms);
			await showRequestSavedSuccess(requestForms.length);
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

	// Helper function to get status options based on request type
	const getStatusOptions = (type: string) => {
		if (type === "borrow") {
			return (
				<>
					<option value="" disabled>Select status...</option>
					{/* <option value="returned">Returned</option> */}
					<option value="not-returned">Not Returned</option>
				</>
			);
		} else if (type === "consume") {
			return (
				<>
					<option value="" disabled>Select status...</option>
					<option value="consumed">Consumed</option>
				</>
			);
		} else {
			return <option value="" disabled>Select status...</option>;
		}
	};

	return (
		<>
			<div className="modal-heading">
				<h1 className="modal-title">Add Request</h1>
				<div className="modal-date-time">
					<p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
					<p>{new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</p>
				</div>

				<button className="close-modal-btn" onClick={handleClose}>
					<i className="ri-close-line"></i>
				</button>
			</div>

			{/* Employee Name (shared) */}
			<div className="modal-content add">
				<form className="add-request-form">
					<div className="form-group">
						<label>Employee Name</label>
						<select
							className={formErrors[0]?.empName ? "invalid-input" : ""}
							value={requestForms[0].empName}
							onChange={(e) => handleFormChange(0, 'empName', e.target.value)}
						>
							<option value="" disabled>Select employee name...</option>
							<option value="1">Bette Anjanelle Cabarles</option>
							<option value="2">Kristine Mae Cleofas</option>
							<option value="3">Christelle Anne Dacapias</option>
							<option value="4">Nerie Ann Bravo</option>
						</select>
						<p className="add-error-message">{formErrors[0]?.empName}</p>
					</div>
				</form>
			</div>


			{/* Add Request Form - allows adding multiple requests */}
			{requestForms.map((form, index) => (
				<div className="modal-content add" key={index}>
					<form className="add-request-form">
						<div className="form-row">
							{/* Request Type */}
							<div className="form-group">
								<label>Request Type</label>
								<select
									className={formErrors[index]?.type ? "invalid-input" : ""}
									value={form.type}
									onChange={(e) => handleFormChange(index, "type", e.target.value)}
								>
									<option value="" disabled>Select request type...</option>
									<option value="borrow">Borrow</option>
									<option value="consume">Consume</option>
								</select>
								<p className="add-error-message">{formErrors[index]?.type}</p>
							</div>

							{/* Status - Dynamic options based on request type */}
							<div className="form-group">
								<label>Status</label>
								<select
									className={formErrors[index]?.reqStatus ? "invalid-input" : ""}
									value={form.reqStatus}
									onChange={(e) => handleFormChange(index, "reqStatus", e.target.value)}
									disabled={!form.type} // Disable if no type is selected
								>
									{getStatusOptions(form.type)}
								</select>
								<p className="add-error-message">{formErrors[index]?.reqStatus}</p>
							</div>
						</div>

						<div className="form-row">
							{/* Item Name */}
							<div className="form-group">
								<label>Item Name</label>
								<select
									className={formErrors[index]?.itemName ? "invalid-input" : ""}
									value={form.itemName}
									onChange={(e) => handleFormChange(index, "itemName", e.target.value)}
								>
									<option value="" disabled>Select item name...</option>
									<option value="1">Item 1</option>
									<option value="2">Item 2</option>
									<option value="3">Item 3</option>
									<option value="4">Item 4</option>
									<option value="5">Item 5</option>
								</select>
								<p className="add-error-message">{formErrors[index]?.itemName}</p>
							</div>

							{/* Quantity */}
							<div className="form-group">
								<label>Quantity</label>
								<input
									className={formErrors[index]?.reqQuantity ? "invalid-input" : ""}
									type="number"
									step="0.1"
									min="0"
									value={form.reqQuantity}
									onChange={(e) => handleFormChange(index, "reqQuantity", Number(e.target.value))}
								/>
								<p className="add-error-message">{formErrors[index]?.reqQuantity}</p>
							</div>
						</div>

						{/* Request Purpose */}
						<div className="form-group">
							<label>Request Purpose</label>
							<textarea
								className={formErrors[index]?.purpose ? "invalid-input" : ""}
								value={form.purpose}
								onChange={(e) => handleFormChange(index, "purpose", e.target.value)}
								placeholder="Enter request purpose here..."
							>
							</textarea>
							<p className="add-error-message">{formErrors[index]?.purpose}</p>
						</div>

						{/* Expected Return Date */}
						{form.type === "borrow" && (
							<div className="form-group">
								<label>Expected Return Date</label>
								<input
									className={formErrors[index]?.expectedDate ? "invalid-input" : ""}
									type="date"
									value={form.expectedDate}
									onChange={(e) => handleFormChange(index, "expectedDate", e.target.value)}
								/>
								<p className="add-error-message">{formErrors[index]?.expectedDate}</p>
							</div>
						)}

					</form>

					{/* Remove Request Button - Only show if there's more than one form */}
					{requestForms.length > 1 && (
						<div className="remove-btn-wrapper">
							<button
								type="button"
								className="remove-request-btn"
								onClick={() => handleRemoveRequest(index)}
							>
								<i className="ri-close-line" /> Remove
							</button>
						</div>
					)}
				</div>
			))}

			<div className="modal-actions add">
				<button type="button" className="add-another-btn" onClick={handleAddAnotherRequest}>
					<i className="ri-add-line" /> Add Another Request
				</button>

				<button type="submit" className="submit-btn" onClick={handleSubmit}>
					<i className="ri-save-3-line" /> Save
				</button>
			</div>

		</>
	);
}