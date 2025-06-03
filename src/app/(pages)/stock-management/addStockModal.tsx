import React, { useState, useEffect } from "react";
import {
	showStockSaveConfirmation, showStockSavedSuccess,
	showCloseWithoutSavingConfirmation, showDuplicateItemError,
	showStockSaveError, showPartialSuccessWarning
} from "@/utils/sweetAlert";
import "@/styles/forms.css";
import { fetchAvailableItems, Item as SupabaseItem } from '../../lib/fetchItems';

// Export the interface so it can be imported by other components
export interface StockForm {
	name: string,
	itemName: string,
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

interface Category {
	category_id: string;
	category_name: string;
}

export default function AddStockModal({ onSave, onClose }: AddStockModalProps) {
	// Initial stock form state
	const initialFormState: StockForm = {
		name: "",
		itemName: "",
		quantity: 0,
		unit: "",
		reorder: 0,
		usable: 0,
		defective: 0,
		missing: 0,
		category: "",
		status: "AVAILABLE",
		expiration: "",
	};

	const [stockForms, setStockForms] = useState<StockForm[]>([initialFormState]);
	const [formErrors, setFormErrors] = useState<FormError[]>([{}]);
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// State for items fetched from Supabase
	const [items, setItems] = useState<SupabaseItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// State for categories
	const [categories, setCategories] = useState<Category[]>([]);

	// Fetch items from Supabase when component mounts
	useEffect(() => {
		async function loadItems() {
			try {
				setIsLoading(true);
				setError(null);
				const data = await fetchAvailableItems();
				setItems(data);
			} catch (error) {
				console.error("Error loading items:", error);
				setError("Failed to load items. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		}

		loadItems();
	}, []);

	// Fetch categories
	useEffect(() => {
		async function loadCategories() {
			try {
				const response = await fetch('/api/category');
				if (!response.ok) {
					throw new Error('Failed to fetch categories');
				}
				const data = await response.json();
				setCategories(data.categories);
			} catch (error) {
				console.error("Error loading categories:", error);
				setError("Failed to load categories. Please try again later.");
			}
		}

		loadCategories();
	}, []);

	// Track if any form has been modified
	useEffect(() => {
		setIsDirty(true);
	}, [stockForms]);

	// Handle item selection - populate unit and category from the selected item
	const handleItemSelection = async (index: number, itemId: string) => {
	try {
		// Find the selected item in our already fetched items array
		const selectedItem = items.find(item => item.f_item_id === itemId);
		
		if (selectedItem) {
			// Check if this item is already selected in another form
			const isDuplicate = stockForms.some((form, i) => 
				i !== index && form.name === itemId
			);

			if (isDuplicate) {
				// Show SweetAlert for duplicate error
				await showDuplicateItemError();
				return;
			}
			const fullItemName = getItemDisplayName(selectedItem);
			console.log('Selected item:', selectedItem); // Debug log
			console.log('Item name for check:', selectedItem.item_name); // Debug log

			let categoryValue = "";
			let reorderValue = 0;

			// Check if item already exists in local database
			try {
				const existingItemResponse = await fetch(`/api/stock?action=check-existing&itemName=${encodeURIComponent(fullItemName)}`);
				
				console.log('API Response status:', existingItemResponse.status); // Debug log
				
				if (!existingItemResponse.ok) {
					throw new Error(`HTTP error! status: ${existingItemResponse.status}`);
				}
				
				const existingItemData = await existingItemResponse.json();
				console.log('Existing item data:', existingItemData); // Debug log

				if (existingItemData.success && existingItemData.exists) {
					// Item exists in local database - use existing category and reorder level
					categoryValue = existingItemData.item.category_name;
					reorderValue = existingItemData.item.reorder_level;
					console.log('Pre-filling with:', { categoryValue, reorderValue }); // Debug log
				}
			} catch (apiError) {
				console.error("Error checking existing item:", apiError);
				// Don't fail the entire operation, just log the error
			}

			// Update the form with data from the selected item
			setStockForms(prev =>
				prev.map((form, i) =>
					i === index
						? {
							...form,
							name: itemId,
							itemName: getItemDisplayName(selectedItem),
							unit: selectedItem.unit_measure || form.unit,
							quantity: selectedItem.purchased_quantity || form.quantity,
							// Set default values for quantities
							usable: selectedItem.purchased_quantity || 0,
							defective: 0,
							missing: 0,
							// Pre-fill category and reorder if item exists in local DB
							category: categoryValue,
							reorder: reorderValue,
						}
						: form
				)
			);

			// Clear errors for the name field
			if (formErrors[index] && formErrors[index].name) {
				const newErrors = [...formErrors];
				delete newErrors[index].name;
				// Also clear category error if we auto-filled it
				if (categoryValue) {
					delete newErrors[index].category;
				}
				// Clear reorder error if we auto-filled it
				if (reorderValue > 0) {
					delete newErrors[index].reorder;
				}
				setFormErrors(newErrors);
			}
		}
	} catch (error) {
		console.error("Error selecting item:", error);
		// You might want to show an error message to the user here
		setError("Failed to load item data. Please try again.");
	}
};

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
			if (form.reorder < 0) errorObj.reorder = "Reorder level must be at least 0";
			if (form.reorder >= form.quantity) errorObj.reorder = "Reorder level must be lower than total quantity";
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

			// Check for duplicate items
			const duplicates = stockForms
				.filter((_, i) => i !== stockForms.indexOf(form))
				.filter((otherForm) => otherForm.name === form.name);
			
			if (duplicates.length > 0) {
				errorObj.duplicate = "This item is already selected in another form";
			}

			return errorObj;
		});

		setFormErrors(errors);
		return errors.every((err) => Object.keys(err).length === 0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		// Show confirmation dialog using SweetAlert
		const result = await showStockSaveConfirmation(stockForms.length);
		
		if (result.isConfirmed) {
			setIsSaving(true);
			try {
				// Use the API to save the stock items to the database
				const response = await fetch('/api/item', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ stockItems: stockForms }),
				});

				// Try to get response body as JSON, even if status is not OK
				let result;
				try {
					result = await response.json();
				} catch (jsonError) {
					console.error('Error parsing JSON response:', jsonError);
					throw new Error('Failed to parse server response');
				}

				if (!response.ok) {
					// Extract more detailed error information if available
					const errorMessage = result && result.error 
						? `Error: ${result.error}` 
						: `Failed to save stock items (Status: ${response.status})`;
					
					if (result && result.details) {
						console.error('Error details:', result.details);
					}
					
					throw new Error(errorMessage);
				}
				
				if (result.success) {
					// Show success message using SweetAlert
					await showStockSavedSuccess(stockForms.length);
					
					// Call the onSave callback to close the modal or update the parent
					onSave(stockForms);
					window.location.reload();
				} else {
					setError(result.error || 'Failed to save stock items');
				}
				
				// Check if there were any partial failures
				if (result.partialFailure) {
					console.warn('Some items were processed successfully, but others failed:', result.results);
					// You could show a warning to the user here using SweetAlert
					await showPartialSuccessWarning();
				}
			} catch (error: any) {
				console.error('Error saving stock items:', error);
				setError(error.message);
				
				// Show error using SweetAlert
				await showStockSaveError(error.message);
			} finally {
				setIsSaving(false);
			}
		}
	};

	const handleClose = async () => {
		if (!isDirty) {
			onClose();
			return;
		}

		// Show confirmation dialog using SweetAlert
		const result = await showCloseWithoutSavingConfirmation();
		if (result.isConfirmed) {
			onClose();
		}
	};

	// Format item display name by combining item_name and custom_for fields
	const getItemDisplayName = (item: SupabaseItem) => {
		return item.custom_for ? `${item.item_name} - ${item.custom_for ?? ""} ${item.item_type ? ` (${item.item_type})` : ""}` : item.item_name;
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

			{/* Loading indicator */}
			{isLoading}

			{/* Error message */}
			{error && <div className="error-message">{error}</div>}

			{/* Add Stock Form - allows adding multiple stocks */}
			{stockForms.map((form, index) => (
				<div className="modal-content add" key={index}>
					<form className="add-stock-form" id={`add-stock-form-${index}`}>
						{/* Item Name */}
						<div className="form-group">
							<label>Item Name</label>
							<select
								className={formErrors[index]?.name || formErrors[index]?.duplicate ? "invalid-input" : ""}
								value={form.name}
								onChange={(e) => handleItemSelection(index, e.target.value)}
								disabled={isLoading || isSaving}
							>
								<option value="" disabled>Select an item...</option>
								{items.map((item) => (
									<option key={item.f_item_id} value={item.f_item_id}>
										{getItemDisplayName(item)}
									</option>
								))}
							</select>
							<p className="add-error-message">
								{formErrors[index]?.name || formErrors[index]?.duplicate}
							</p>
						</div>

						<div className="form-row">
							{/* Quantity */}
							<div className="form-group">
								<label>Total Quantity</label>
								<input disabled
									type="number"
									step="1"
									min="0"
									value={form.quantity}
								/>
							</div>

							{/* Unit Measure */}
							<div className="form-group">
								<label>Unit Measure</label>
								<input disabled 
									value={form.unit}
								/>
							</div>

							{/* Reorder Level */}
							<div className="form-group">
								<label>Reorder Level</label>
								<input
									className={formErrors[index]?.reorder ? "invalid-input" : ""}
									type="number"
									step="1"
									min="0"
									value={form.reorder}
									onChange={(e) => handleFormChange(index, "reorder", Number(e.target.value))}
									disabled={isSaving}
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
									step="1"
									min="0"
									value={form.usable}
									onChange={(e) => handleFormChange(index, "usable", Number(e.target.value))}
									disabled={isSaving}
								/>
							</div>

							{/* Defective */}
							<div className="form-group">
								<label>Defective Quantity</label>
								<input
									className={formErrors[index]?.defective ? "invalid-input" : ""}
									type="number"
									step="1"
									min="0"
									value={form.defective}
									onChange={(e) => handleFormChange(index, "defective", Number(e.target.value))}
									disabled={isSaving}
								/>
							</div>

							{/* Missing */}
							<div className="form-group">
								<label>Missing Quantity</label>
								<input
									className={formErrors[index]?.missing ? "invalid-input" : ""}
									type="number"
									step="1"
									min="0"
									value={form.missing}
									onChange={(e) => handleFormChange(index, "missing", Number(e.target.value))}
									disabled={isSaving}
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
									disabled={isSaving || !!form.category}
								>
									<option value="" disabled>Select category...</option>
									{categories.map(category => (
										<option 
											key={category.category_id} 
											value={category.category_name}
										>
											{category.category_name}
										</option>
									))}
								</select>
								<p className="add-error-message">{formErrors[index]?.category}</p>
							</div>

							{/* Status */}
							<div className="form-group">
								<label>Status</label>
								<input 
									disabled value={form.status}
								/>
							</div>
						</div>

						{/* Expiration Date */}
						{form.category === "Consumable" && (
							<div className="form-group">
								<label>Expiration Date</label>
								<input
									className={formErrors[index]?.expiration ? "invalid-input" : ""}
									type="date"
									value={form.expiration}
									onChange={(e) => handleFormChange(index, "expiration", e.target.value)}
									disabled={isSaving}
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
								disabled={isSaving}
							>
								<i className="ri-close-line" /> Remove
							</button>
						</div>
					)}
				</div>
			))}

			<div className="modal-actions add">
				<button type="button" className="add-another-btn" onClick={handleAddAnotherStock}
					disabled={isSaving}>
					<i className="ri-add-line" /> Add Another Stock
				</button>

				<button type="submit" className="submit-btn" onClick={handleSubmit} 
					disabled={isSaving}>
					<i className="ri-save-3-line" /> {isSaving ? 'Saving...' : 'Save'}
				</button>
			</div>
		</>
	);
}