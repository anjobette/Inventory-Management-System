import { showDeleteExpiredConfirmation, showDeleteExpiredSuccess } from "@/utils/sweetAlert";
import "@/styles/forms.css";

interface ViewStockModalProps {
	item: {
		item_id: string;
		f_item_id: string;
		item_name: string;
		current_stock: number;
		unit_measure: string;
		status: string;
		category_id: string;
		category: {
			category_id: string;
			category_name: string;
		};
		date_updated: string;
		date_created?: string;
		reorder_level: number;
		batches: {
			batch_id: string;
			usable_quantity: number;
			defective_quantity: number;
			missing_quantity: number;
			expiration_date: string | null;
			date_created?: string;
			isdeleted: boolean;
		}[];
	};
	formatStatus: (status: string) => string;
	onClose: () => void;
	onBatchDeleted?: () => void; // Optional callback to refresh data after deletion
}

export default function ViewStockModal({ item, formatStatus, onClose, onBatchDeleted }: ViewStockModalProps) {
	// Helper function to format date
	const formatDate = (dateString: string | undefined) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Helper function to check if batch is expired
	const isBatchExpired = (expirationDate: string | null) => {
		if (!expirationDate) return false;

		// Get today's date at midnight (start of day)
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Get expiration date at midnight (start of day)
		const expDate = new Date(expirationDate);
		expDate.setHours(0, 0, 0, 0);

		// Item is expired if expiration date is today or before today
		return expDate <= today;
	};

	// Helper function to get batch container class
	const getBatchContainerClass = (expirationDate: string | null) => {
		return isBatchExpired(expirationDate) ? "modal-content view-expired"
			: "modal-content view";
	};

	// Handle remove expired batch
	const handleRemoveExpired = async (batchId: string) => {
		try {
			const result = await showDeleteExpiredConfirmation(batchId);
			if (result.isConfirmed) {
				// Call the API to delete the batch
				const response = await fetch('/api/stock', {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ batch_id: batchId }),
				});

				const data = await response.json();

				if (data.success) {
					await showDeleteExpiredSuccess(batchId);
					// Call the callback to refresh data if provided
					if (onBatchDeleted) {
						onBatchDeleted();
					}
					
					onClose();
					window.location.reload();
				} else {
					// Handle error case
					console.error('Failed to delete batch:', data.error);
					// You might want to show an error alert here
				}
			}
		} catch (error) {
			console.error('Error deleting batch:', error);
			// You might want to show an error alert here
		}
	};

	// Filter batches to only show non-deleted batches with quantity > 0
	const filteredBatches = item.batches?.filter(batch => 
		!batch.isdeleted && batch.usable_quantity > 0
	) || [];

	return (
		<>
			<button className="close-modal-btn" onClick={onClose}>
				<i className="ri-close-line"></i>
			</button>

			<div className="modal-heading">
				<h1 className="modal-title">{item.item_name}</h1>
				<div>
					<p className="modal-date-time">
					Date Created: {formatDate(item.date_created)}
					</p>
					<p className="modal-date-time">
					Date Updated: {formatDate(item.date_updated)}
					</p>
				</div>
				
			</div>

			<div className="modal-content view">
				<div className="view-stock-form">
					<div className="form-row">
						<div className="form-group">
							<label>Current Stock</label>
							<p>{item.current_stock}</p>
						</div>

						<div className="form-group">
							<label>Unit Measure</label>
							<p>{item.unit_measure}</p>
						</div>

						<div className="form-group">
							<label>Reorder Level</label>
							<p>{item.reorder_level}</p>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Category</label>
							<p>{item.category.category_name}</p>
						</div>

						<div className="form-group">
							<label>Status</label>
							<p>{formatStatus(item.status)}</p>
						</div>
					</div>
				</div>
			</div>

			<h1 className="modal-subtitle">Batches</h1>

			{filteredBatches && filteredBatches.length > 0 ? (
				filteredBatches.map((batch) => (
					<div key={batch.batch_id} className={getBatchContainerClass(batch.expiration_date)}>
						<div className="view-stock-form">
							<div className="form-row">
								<div className="form-group">
									<label>Quantity</label>
									<p>{batch.usable_quantity}</p>
								</div>

								<div className="form-group">
									<label>Expiration Date</label>
									<p>
										{batch.expiration_date
											? formatDate(batch.expiration_date)
											: "No expiration date"
										}
									</p>
								</div>

								<div className="form-group">
									<label>Date Added</label>
									<p>{formatDate(batch.date_created)}</p>
								</div>

								{/* Add remove button only for expired batches */}
								{isBatchExpired(batch.expiration_date) && (
									<div className="remove-btn-wrapper expired">
										<button
											type="button"
											className="remove-stock-btn"
											onClick={() => handleRemoveExpired(batch.batch_id)}
										>
											<i className="ri-delete-bin-line" />
										</button>
									</div>
								)}
							</div>


						</div>
					</div>
				))
			) : (
				<div className="modal-content view">
					<div className="view-stock-form">
						<div className="form-row">
							<div className="form-group" style={{ textAlign: 'center', width: '100%' }}>
								<p style={{ fontStyle: 'italic', color: '#666' }}>
									No batches available for this item
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}