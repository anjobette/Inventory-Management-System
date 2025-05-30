import "@/styles/forms.css";

interface ViewStockModalProps {
	item: {
		id: number;
		name: string;
		quantity: number;
		unit: string;
		status: string;
		reorder: number;
		// Additional fields would be included in a real application
	};
	formatStatus: (status: string) => string;
	onClose: () => void;
}

export default function ViewStockModal({ item, formatStatus, onClose }: ViewStockModalProps) {
	return (
		<>
			<button className="close-modal-btn" onClick={onClose}>
				<i className="ri-close-line"></i>
			</button>

			<div className="modal-heading">
				<h1 className="modal-title">{item.name}</h1>
			</div>

			<h1 className="modal-subtitle">Overview</h1>

			<div className="modal-content view">
				<div className="view-stock-form">
					<div className="form-row">
						<div className="form-group">
							<label>Quantity</label>
							<p>{item.quantity}</p>
						</div>

						<div className="form-group">
							<label>Unit Measure</label>
							<p>{item.unit}</p>
						</div>

						<div className="form-group">
							<label>Reorder Level</label>
							<p>{item.reorder}</p>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Category</label>
							<p>Consumable</p>
						</div>

						<div className="form-group">
							<label>Status</label>
							<p>{formatStatus(item.status)}</p>
						</div>
					</div>
				</div>
			</div>

			<h1 className="modal-subtitle">Batches</h1>

			<div className="modal-content view">
				<div className="view-stock-form">
					<div className="form-row">
						<div className="form-group">
							<label>Quantity</label>
							<p>20</p>
						</div>

						<div className="form-group">
							<label>Expiration Date</label>
							<p>March 2, 2027</p>
						</div>

						<div className="form-group">
							<label>Date Added</label>
							<p>April 22, 2025</p>
						</div>
					</div>
				</div>
			</div>

			<div className="modal-content view-expired">
				<div className="view-stock-form">
					<div className="form-row">
						<div className="form-group">
							<label>Quantity</label>
							<p>50</p>
						</div>

						<div className="form-group">
							<label>Expiration Date</label>
							<p>May 23, 2025</p>
						</div>

						<div className="form-group">
							<label>Date Added</label>
							<p>February 9, 2025</p>
						</div>
					</div>
				</div>
			</div>

			<div className="modal-content view">
				<div className="view-stock-form">
					<div className="form-row">
						<div className="form-group">
							<label>Quantity</label>
							<p>20</p>
						</div>

						<div className="form-group">
							<label>Expiration Date</label>
							<p>March 2, 2027</p>
						</div>

						<div className="form-group">
							<label>Date Added</label>
							<p>April 22, 2025</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}