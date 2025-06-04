import "@/styles/forms.css";

interface ViewOrderModalProps {
    item: {
        id: number;
        itemName: string;
        ordQuantity: number,
        ordReqDate: string,
        ordStatus: string,
        // Additional fields would be included in a real application
    };
    formatStatus: (status: string) => string;
    onClose: () => void;
}

export default function ViewOrderModal({ item, formatStatus, onClose }: ViewOrderModalProps) {
    return (
        <>
            <button className="close-modal-btn" onClick={onClose}>
                <i className="ri-close-line"></i>
            </button>

            <div className="modal-heading">
                <h1 className="modal-title">View Order</h1>
            </div>

            <div className="modal-content view">
                <div className="view-order-form">
                    <div className="form-group">
                        <label>Item Name</label>
                        <p>{item.itemName}</p>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <p>{item.ordQuantity}</p>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <p>{formatStatus(item.ordStatus)}</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Request Date</label>
                        <p>{item.ordReqDate}</p>
                    </div>

                    <div className="form-group">
                        <label>Reason for Order Request</label>
                        <p className="">Reason...</p>
                    </div>

                </div>
            </div>
        </>
    );
}