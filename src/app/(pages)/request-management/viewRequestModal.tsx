import "@/styles/forms.css";

interface ViewRequestModalProps {
	item: {
		id: number;
		empName: string;
		type: string;
		itemName: string;
		reqDate: string;
		reqStatus: string;
		// Additional fields would be included in a real application
	};
	formatStatus: (status: string) => string;
	onClose: () => void;
}

export default function ViewRequestModal({ item, formatStatus, onClose }: ViewRequestModalProps) {
	return (
		<>
			<button className="close-modal-btn" onClick={onClose}>
				<i className="ri-close-line"></i>
			</button>

			<div className="modal-heading">
				<h1 className="modal-title">View Request</h1>
			</div>

			<div className="modal-content view">
				<div className="view-request-form">
					<div className="form-group">
						<label>Employee Name</label>
						<p>{item.empName}</p>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Request Type</label>
							<p>{item.type}</p>
						</div>

						<div className="form-group">
							<label>Status</label>
							<p>{formatStatus(item.reqStatus)}</p>
						</div>
					</div>

					<div className="form-row">
						<div className="form-group">
							<label>Item Name</label>
							<p>{item.itemName}</p>
						</div>

						<div className="form-group">
							<label>Quantity</label>
							<p>55</p>
						</div>
					</div>

					<div className="form-group">
						<label>Request Purpose</label>
						<p>Purpose...</p>
					</div>

					<div className="form-group">
						<label>Request Date</label>
						<p>{item.reqDate}</p>
					</div>

					{item.type === "Borrow" && (
						<div className="form-row">
							<div className="form-group">
								<label>Expected Return Date</label>
								<p>11/22/2025</p>
							</div>

							{item.reqStatus !== "not-returned" && (
								<div className="form-group">
									<label>Actual Return Date</label>
									<p>11/22/2025</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}